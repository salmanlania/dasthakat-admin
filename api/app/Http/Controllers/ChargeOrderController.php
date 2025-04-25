<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\JobOrder;
use App\Models\Picklist;
use App\Models\PicklistDetail;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use App\Models\Quotation;
use App\Models\Salesman;
use App\Models\Servicelist;
use App\Models\ServicelistDetail;
use App\Models\Shipment;
use App\Models\StockLedger;
use App\Models\Supplier;
use App\Models\Technician;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ChargeOrderController extends Controller
{
	protected $document_type_id = 39;
	protected $db;

	public function index(Request $request)
	{
		$customer_id = $request->input('customer_id', '');
		$document_identity = $request->input('document_identity', '');
		$ref_document_identity = $request->input('ref_document_identity', '');
		$document_date = $request->input('document_date', '');
		$vessel_id = $request->input('vessel_id', '');
		$event_id = $request->input('event_id', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'charge_order.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = ChargeOrder::LeftJoin('customer as c', 'c.customer_id', '=', 'charge_order.customer_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'charge_order.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'charge_order.vessel_id');
		$data = $data->where('charge_order.company_id', '=', $request->company_id);
		$data = $data->where('charge_order.company_branch_id', '=', $request->company_branch_id);

		if (!empty($customer_id)) $data = $data->where('charge_order.customer_id', '=',  $customer_id);
		if (!empty($vessel_id)) $data = $data->where('charge_order.vessel_id', '=',  $vessel_id);
		if (!empty($event_id)) $data = $data->where('charge_order.event_id', '=',  $event_id);
		if (!empty($document_identity)) $data = $data->where('charge_order.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('charge_order.document_date', '=',  $document_date);
		if (!empty($ref_document_identity)) $data = $data->where('charge_order.ref_document_identity', 'like', '%' .  $ref_document_identity . '%');

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('c.name', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('ref_document_identity', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('charge_order.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("charge_order.*", DB::raw("CONCAT(e.event_code, ' (', CASE 
		WHEN e.status = 1 THEN 'Active' 
		ELSE 'Inactive' 
	END, ')') AS event_code"), "c.name as customer_name", "v.name as vessel_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = ChargeOrder::with(
			"charge_order_detail",
			"charge_order_detail.product",
			"charge_order_detail.product_type",
			"charge_order_detail.unit",
			"charge_order_detail.supplier",
			"salesman",
			"event",
			"vessel",
			"customer",
			"flag",
			"class1",
			"class2",
			"agent",
		)
			->where('charge_order_id', $id)->first();

		$technicianIds = $data->technician_id;
		if (!is_array($technicianIds) || empty($technicianIds)) {
			$data->technicians = null;
		} else {
			$data->technicians = User::whereIn('user_id', $technicianIds)->get(); // user_id used in technician_id
		}
		if ($data) {
			foreach ($data->charge_order_detail as &$detail) {
				$detail->picked_quantity = 	$this->getPickedQuantity($detail);
				if ($detail->product) {
					$detail->product->stock = StockLedger::Check($detail->product, $request->all());
				}
			}
		}
		return $this->jsonResponse($data, 200, "Charge Order Data");
	}

	public function Validator($request, $id = null)
	{
		$rules = [
			'document_date' => ['required'],
		];

		$msg = validateRequest($request, $rules);
		if (!empty($msg)) return $msg;
	}


	public function getDetailedAnalysis($id)
	{
		$record = ChargeOrder::with([
			"salesman",
			"event",
			"vessel",
			"customer",
			"flag",
			"class1",
			"class2",
			"agent",
			'charge_order_detail',
			'charge_order_detail.product',
			'charge_order_detail.product_type',
			'charge_order_detail.unit',
			'charge_order_detail.supplier',
		])
			->where('charge_order_id', $id)
			->firstOrFail();

		foreach ($record->charge_order_detail as &$detail) {
			$detail->picked_quantity = $this->getPickedQuantity($detail);
			$detail->shipped_quantity = $this->getShipmentQuantity($detail);
			$detail->invoiced_quantity = $this->getInvoicedQuantity($detail);
		}
		return $this->jsonResponse($record, 200, "Charge Order Detailed Analysis.");
	}
	public function getVendorWiseDetails($id)
	{
		$record = ChargeOrder::with(['charge_order_detail', 'charge_order_detail.product'])
			->where('charge_order_id', $id)
			->firstOrFail();

		$po_ref = PurchaseOrderDetail::with('purchase_order')
			->whereHas('purchase_order', function ($query) use ($id) {
				$query->where('charge_order_id', $id);
			})
			->get();

		$existingChargeDetailIds = $po_ref->pluck('charge_order_detail_id')->all();

		$filteredDetails = collect($record->charge_order_detail)->filter(function ($row) use ($existingChargeDetailIds) {
			return in_array($row->product_type_id, [3, 4]) &&
				!in_array($row->charge_order_detail_id, $existingChargeDetailIds);
		});

		$vendorWiseDetails = $filteredDetails->groupBy('supplier_id')->map(function ($items, $supplierId) {
			return [
				"supplier_id" => $supplierId,
				"supplier_name" => optional($items->first()->supplier)->name ?? "Unknown Supplier",
			];
		})->values();

		return $this->jsonResponse($vendorWiseDetails, 200, "Vendor-wise charge order details fetched successfully.");
	}
	public function createPurchaseOrders(Request $request)
	{
		$data = $request->all();
		$chargeOrderId = $data['charge_order_id'];

		$chargeOrder = ChargeOrder::where('charge_order_id', $chargeOrderId)->first();
		$Quotation = Quotation::where('document_identity', $chargeOrder->ref_document_identity)->first();

		foreach ($data['vendors'] as $vendor) {
			$supplierId = $vendor['supplier_id'] ?? null;
			$requiredDate = $vendor['required_date'] ?? null;
			$shipVia = $vendor['ship_via'] ?? null;
			$shipTo = $vendor['ship_to'] ?? null;

			$chargeOrderDetails = ChargeOrderDetail::whereHas('charge_order', function ($query) use ($chargeOrderId, $supplierId) {
				$query->where('charge_order_id', $chargeOrderId)
					->where('supplier_id', $supplierId);
			})->with('product')->get();

			if ($chargeOrderDetails->isEmpty()) {
				continue;
			}

			$uuid = $this->get_uuid();
			$document = DocumentType::getNextDocument(40, $request);

			$totalQuantity = $chargeOrderDetails->sum('quantity');
			$totalAmount = $chargeOrderDetails->sum(fn($item) => $item->quantity * $item->cost_price);
			$vendorDetails = Supplier::where('supplier_id', $supplierId)->firstOrFail();

			$purchaseOrder = [
				'company_id'        => $request->company_id,
				'company_branch_id' => $request->company_branch_id,
				'purchase_order_id' => $uuid,
				'charge_order_id'   => $chargeOrderId ?? "", // Linking Charge Order ID
				'quotation_id'   => $Quotation->quotation_id ?? "", // Linking Charge Order ID
				'document_type_id'  => $document['document_type_id'] ?? "",
				'document_no'       => $document['document_no'] ?? "",
				'document_prefix'   => $document['document_prefix'] ?? "",
				'document_identity' => $document['document_identity'] ?? "",
				'document_date'     => Carbon::now(),
				'supplier_id'       => $supplierId,
				'payment_id'       => $vendorDetails['payment_id'] ?? "",
				'type'              => "Buyout",
				'buyer_id'          => $request->login_user_id,
				'total_quantity'    => $totalQuantity,
				'total_amount'      => $totalAmount,
				'required_date'     => $requiredDate ?? "",
				'ship_via'          => $shipVia ?? "",
				'ship_to'           => $shipTo ?? "",
				'created_at'        => Carbon::now(),
				'created_by'        => $request->login_user_id,
			];

			PurchaseOrder::insert($purchaseOrder);

			// Insert Purchase Order Details
			foreach ($chargeOrderDetails as $index => $detail) {
				$purchase_order_detail_id = $this->get_uuid();

				$purchaseOrderDetail = [
					'purchase_order_id'        => $uuid,
					'purchase_order_detail_id' => $purchase_order_detail_id,
					'charge_order_detail_id'   => $detail->charge_order_detail_id,
					'sort_order'               => $detail->sort_order,
					'product_id'               => $detail->product_id ?? "",
					'product_type_id'          => $detail->product_type_id ?? "",
					'product_name'             => $detail->product_name ?? "",
					'product_description'      => $detail->product_description ?? "",
					'description'              => $detail->description ?? "",
					'vpart'                    => $detail->vendor_part_no ?? "",
					'unit_id'                  => $detail->unit_id ?? "",
					'quantity'                 => $detail->quantity ?? "",
					'rate'                     => $detail->cost_price ?? "",
					'amount'                   => ($detail->quantity ?? 0) * ($detail->cost_price ?? 0),
					'created_at'               => Carbon::now(),
					'created_by'               => $request->login_user_id,
				];

				PurchaseOrderDetail::insert($purchaseOrderDetail);

				// ChargeOrderDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)
				// 	->update([
				// 		'purchase_order_id'        => $uuid,
				// 		'purchase_order_detail_id' => $purchase_order_detail_id,
				// 	]);
			}
		}

		return $this->jsonResponse(null, 200, "Purchase Orders Created Successfully.");
	}

	public function updatePicklist($request, $chargeOrder)
	{
		$inventoryDetails = $chargeOrder->charge_order_detail
			->where('product_type_id', 2)
			->where('picklist_detail_id', null);

		if ($inventoryDetails->isEmpty()) {
			return;
		}

		$totalQuantity = $inventoryDetails->sum('quantity');
		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument(43, $request);

		$picklist = Picklist::firstOrCreate(
			['charge_order_id' => $chargeOrder->charge_order_id],
			[
				'company_id'         => $request->company_id,
				'company_branch_id'  => $request->company_branch_id,
				'picklist_id'        => $uuid,
				'document_type_id'   => $document['document_type_id'],
				'document_date'      =>  Carbon::now(),
				'document_no'        => $document['document_no'],
				'document_identity'  => $document['document_identity'],
				'document_prefix'    => $document['document_prefix'],
				'total_quantity'     => $totalQuantity,
				'created_at'         =>  Carbon::now(),
				'created_by'         => $request->login_user_id,
			]
		);

		// If picklist already existed, update its total quantity
		if (!$picklist->wasRecentlyCreated) {
			$picklist->update([
				'total_quantity' => $totalQuantity,
				'updated_at'     =>  Carbon::now(),
				'updated_by'     => $request->login_user_id,
			]);
		}

		$existingDetails = PicklistDetail::where('picklist_id', $picklist->picklist_id)
			->get()
			->keyBy('charge_order_detail_id');

		$existingChargeOrderDetailIds = $existingDetails->keys();

		$newChargeOrderDetailIds = $inventoryDetails->pluck('charge_order_detail_id');

		// Delete details that no longer exist
		$detailsToDelete = $existingChargeOrderDetailIds->diff($newChargeOrderDetailIds);
		if ($detailsToDelete->isNotEmpty()) {
			PicklistDetail::where('picklist_id', $picklist->picklist_id)
				->whereIn('charge_order_detail_id', $detailsToDelete)
				->delete();
		}

		$picklistDetailInsert = [];
		$index = 0;

		foreach ($inventoryDetails as $item) {
			if (isset($existingDetails[$item->charge_order_detail_id])) {
				// Update existing detail
				$existingDetails[$item->charge_order_detail_id]->update([
					'quantity'   => $item->quantity ?? 0,
					'updated_at' =>  Carbon::now(),
					'updated_by' => $request->login_user_id,
				]);
			} else {
				// Insert new detail
				$picklistDetailInsert[] = [
					'picklist_id'            => $picklist->picklist_id,
					'picklist_detail_id'     => $this->get_uuid(),
					'sort_order'             => $index++,
					'charge_order_detail_id' => $item->charge_order_detail_id,
					'product_id'             => $item->product_id,
					'sort_order'             => $item->sort_order,
					'product_description'    => $item->product_description,
					'quantity'               => $item->quantity ?? 0,
					'created_at'             =>  Carbon::now(),
					'created_by'             => $request->login_user_id,
				];
			}
		}

		if (!empty($picklistDetailInsert)) {
			PicklistDetail::insert($picklistDetailInsert);
		}
	}
	public function updateServicelist($request, $chargeOrder)
	{
		$inventoryDetails = $chargeOrder->charge_order_detail
			->where('product_type_id', 1)
			->where('servicelist_detail_id', null);

		if ($inventoryDetails->isEmpty()) {
			return;
		}

		$totalQuantity = $inventoryDetails->sum('quantity');
		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument(46, $request);

		$servicelist = Servicelist::firstOrCreate(
			['charge_order_id' => $chargeOrder->charge_order_id],
			[
				'company_id'         => $request->company_id,
				'company_branch_id'  => $request->company_branch_id,
				'servicelist_id'        => $uuid,
				'document_type_id'   => $document['document_type_id'],
				'document_date'      =>  Carbon::now(),
				'document_no'        => $document['document_no'],
				'document_identity'  => $document['document_identity'],
				'document_prefix'    => $document['document_prefix'],
				'total_quantity'     => $totalQuantity,
				'created_at'         =>  Carbon::now(),
				'created_by'         => $request->login_user_id,
			]
		);

		// If picklist already existed, update its total quantity
		if (!$servicelist->wasRecentlyCreated) {
			$servicelist->update([
				'total_quantity' => $totalQuantity,
				'updated_at'     =>  Carbon::now(),
				'updated_by'     => $request->login_user_id,
			]);
		}

		$existingDetails = ServicelistDetail::where('servicelist_id', $servicelist->servicelist_id)
			->get()
			->keyBy('charge_order_detail_id');

		$existingChargeOrderDetailIds = $existingDetails->keys();

		$newChargeOrderDetailIds = $inventoryDetails->pluck('charge_order_detail_id');

		// Delete details that no longer exist
		$detailsToDelete = $existingChargeOrderDetailIds->diff($newChargeOrderDetailIds);
		if ($detailsToDelete->isNotEmpty()) {
			ServicelistDetail::where('servicelist_id', $servicelist->servicelist_id)
				->whereIn('charge_order_detail_id', $detailsToDelete)
				->delete();
		}

		$servicelistDetailInsert = [];
		$index = 0;

		foreach ($inventoryDetails as $item) {
			if (isset($existingDetails[$item->charge_order_detail_id])) {
				// Update existing detail
				$existingDetails[$item->charge_order_detail_id]->update([
					'quantity'   => $item->quantity ?? 0,
					'updated_at' =>  Carbon::now(),
					'updated_by' => $request->login_user_id,
				]);
			} else {
				// Insert new detail
				$servicelistDetailInsert[] = [
					'servicelist_id'            => $servicelist->servicelist_id,
					'servicelist_detail_id'     => $this->get_uuid(),
					'sort_order'             => $index++,
					'charge_order_detail_id' => $item->charge_order_detail_id,
					'product_id'             => $item->product_id,
					'quantity'               => $item->quantity ?? 0,
					'sort_order'             => $item->sort_order,
					'created_at'             =>  Carbon::now(),
					'created_by'             => $request->login_user_id,
				];
			}
		}

		if (!empty($servicelistDetailInsert)) {
			ServicelistDetail::insert($servicelistDetailInsert);
		}
	}
	public function updatePurchaseOrders($request, $chargeOrder) {}



	public function store(Request $request)
	{

		if (!isPermission('add', 'charge_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->Validator($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'charge_order_id' => $uuid,
			'document_type_id' => $document['document_type_id'] ?? "",
			'document_no' => $document['document_no'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_prefix' => $document['document_prefix'] ?? "",
			'ref_document_type_id' => $request->ref_document_type_id ?? "",
			'ref_document_identity' => $request->ref_document_identity ?? "",
			'document_date' => ($request->document_date) ?? "",
			'salesman_id' => $request->salesman_id ?? "",
			'customer_po_no' => $request->customer_po_no ?? "",
			'customer_id' => $request->customer_id ?? "",
			'event_id' => $request->event_id ?? "",
			'vessel_id' => $request->vessel_id ?? "",
			'flag_id' => $request->flag_id ?? "",
			'class1_id' => $request->class1_id ?? "",
			'class2_id' => $request->class2_id ?? "",
			'agent_id' => $request->agent_id ?? "",
			'technician_id' => $request->technician_id ?? "",
			'agent_notes' => $request->agent_notes ?? "",
			'technician_notes' => $request->technician_notes ?? "",
			'remarks' => $request->remarks ?? "",
			'total_quantity' => $request->total_quantity ?? "",
			'total_amount' => $request->total_amount ?? 0,
			'discount_amount' => $request->discount_amount ?? 0,
			'net_amount' => $request->net_amount ?? 0,
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		];
		$chargeOrder = ChargeOrder::create($insertArr);

		if ($request->charge_order_detail) {
			foreach ($request->charge_order_detail as $key => $value) {
				$detail_uuid = $this->get_uuid();
				$insert = [
					'charge_order_id' => $insertArr['charge_order_id'],
					'charge_order_detail_id' => $detail_uuid,
					'sort_order' => $value['sort_order'] ?? "",
					'product_code' => $value['product_code'] ?? "",
					'product_id' => $value['product_id'] ?? "",
					'product_name' => $value['product_name'] ?? "",
					'product_description' => $value['product_description'] ?? "",
					'product_type_id' => $value['product_type_id'] ?? "",
					'quotation_detail_id' => $value['quotation_detail_id'] ?? "",
					'internal_notes' => $value['internal_notes'] ?? "",
					'description' => $value['description'] ?? "",
					'warehouse_id' => $value['warehouse_id'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					'supplier_id' => $value['supplier_id'] ?? "",
					'vendor_part_no' => $value['vendor_part_no'] ?? "",
					'cost_price' => $value['cost_price'] ?? "",
					'markup' => $value['markup'] ?? "",
					'quantity' => $value['quantity'] ?? "",
					'rate' => $value['rate'] ?? "",
					'amount' => $value['amount'] ?? "",
					'discount_amount' => $value['discount_amount'] ?? "",
					'discount_percent' => $value['discount_percent'] ?? "",
					'gross_amount' => $value['gross_amount'] ?? "",
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id,
				];

				ChargeOrderDetail::create($insert);
			}
		}

		$this->updatePicklist($request, $chargeOrder);
		$this->updateServicelist($request, $chargeOrder);


		return $this->jsonResponse(['charge_order_id' => $uuid], 200, "Add Charge Order Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'charge_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->Validator($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$chargeOrder = ChargeOrder::findOrFail($id);

		$chargeOrder->fill([
			'company_id' => $request->company_id,
			'company_branch_id' => $request->company_branch_id,
			'document_date' => $request->document_date,
			'salesman_id' => $request->salesman_id,
			'customer_po_no' => $request->customer_po_no,
			'customer_id' => $request->customer_id,
			'event_id' => $request->event_id,
			'vessel_id' => $request->vessel_id,
			'flag_id' => $request->flag_id,
			'class1_id' => $request->class1_id,
			'class2_id' => $request->class2_id,
			'agent_id' => $request->agent_id,
			'technician_id' => $request->technician_id,
			'agent_notes' => $request->agent_notes,
			'technician_notes' => $request->technician_notes,
			'remarks' => $request->remarks,
			'total_quantity' => $request->total_quantity,
			'total_amount' => $request->total_amount,
			'discount_amount' => $request->discount_amount,
			'net_amount' => $request->net_amount,
			'updated_by' => $request->login_user_id,
		])->save();


		if ($request->charge_order_detail) {
			foreach ($request->charge_order_detail as $value) {
				try {
					if ($value['row_status'] == 'I') {
						$detail_uuid = $this->get_uuid();
						$insertArr = [
							'charge_order_id' => $id,
							'charge_order_detail_id' => $detail_uuid,
							'sort_order' => $value['sort_order'] ?? 0,
							'product_code' => $value['product_code'] ?? "",
							'purchase_order_id' => $value['purchase_order_id'] ?? "",
							'purchase_order_detail_id' => $value['purchase_order_detail_id'] ?? "",
							'shipment_id' => $value['shipment_id'] ?? "",
							'shipment_detail_id' => $value['shipment_detail_id'] ?? "",
							'picklist_id' => $value['picklist_id'] ?? "",
							'picklist_detail_id' => $value['picklist_detail_id'] ?? "",
							'job_order_id' => $value['job_order_id'] ?? "",
							'job_order_detail_id' => $value['job_order_detail_id'] ?? "",
							'service_order_id' => $value['service_order_id'] ?? "",
							'service_order_detail_id' => $value['service_order_detail_id'] ?? "",
							'servicelist_id' => $value['servicelist_id'] ?? "",
							'servicelist_detail_id' => $value['servicelist_detail_id'] ?? "",
							'quotation_detail_id' => $value['quotation_detail_id'] ?? "",
							'product_id' => $value['product_id'] ?? "",
							'product_name' => $value['product_name'] ?? "",
							'internal_notes' => $value['internal_notes'] ?? "",
							'product_description' => $value['product_description'] ?? "",
							'product_type_id' => $value['product_type_id'] ?? "",
							'description' => $value['description'] ?? "",
							'warehouse_id' => $value['warehouse_id'] ?? "",
							'unit_id' => $value['unit_id'] ?? "",
							'supplier_id' => $value['supplier_id'] ?? "",
							'quantity' => $value['quantity'] ?? "",
							'vendor_part_no' => $value['vendor_part_no'] ?? "",
							'cost_price' => $value['cost_price'] ?? "",
							'markup' => $value['markup'] ?? "",
							'rate' => $value['rate'] ?? "",
							'amount' => $value['amount'] ?? "",
							'discount_amount' => $value['discount_amount'] ?? "",
							'discount_percent' => $value['discount_percent'] ?? "",
							'gross_amount' => $value['gross_amount'] ?? "",
							'created_at' => Carbon::now(),
							'created_by' => $request->login_user_id,
						];
						ChargeOrderDetail::create($insertArr);
					}
					if ($value['row_status'] == 'U') {
						$update = [
							'sort_order' => $value['sort_order'] ?? 0,
							'product_code' => $value['product_code'] ?? "",
							'purchase_order_id' => $value['purchase_order_id'] ?? "",
							'purchase_order_detail_id' => $value['purchase_order_detail_id'] ?? "",
							'shipment_id' => $value['shipment_id'] ?? "",
							'shipment_detail_id' => $value['shipment_detail_id'] ?? "",
							'picklist_id' => $value['picklist_id'] ?? "",
							'picklist_detail_id' => $value['picklist_detail_id'] ?? "",
							'job_order_id' => $value['job_order_id'] ?? "",
							'job_order_detail_id' => $value['job_order_detail_id'] ?? "",
							'service_order_id' => $value['service_order_id'] ?? "",
							'service_order_detail_id' => $value['service_order_detail_id'] ?? "",
							'servicelist_id' => $value['servicelist_id'] ?? "",
							'servicelist_detail_id' => $value['servicelist_detail_id'] ?? "",
							'quotation_detail_id' => $value['quotation_detail_id'] ?? "",
							'product_id' => $value['product_id'] ?? "",
							'product_name' => $value['product_name'] ?? "",
							'internal_notes' => $value['internal_notes'] ?? "",
							'product_description' => $value['product_description'] ?? "",
							'product_type_id' => $value['product_type_id'] ?? "",
							'description' => $value['description'] ?? "",
							'warehouse_id' => $value['warehouse_id'] ?? "",
							'unit_id' => $value['unit_id'] ?? "",
							'supplier_id' => $value['supplier_id'] ?? "",
							'quantity' => $value['quantity'] ?? "",
							'vendor_part_no' => $value['vendor_part_no'] ?? "",
							'cost_price' => $value['cost_price'] ?? "",
							'markup' => $value['markup'] ?? "",
							'rate' => $value['rate'] ?? "",
							'amount' => $value['amount'] ?? "",
							'discount_amount' => $value['discount_amount'] ?? "",
							'discount_percent' => $value['discount_percent'] ?? "",
							'gross_amount' => $value['gross_amount'] ?? "",
							'updated_at' => Carbon::now(),
							'updated_by' => $request->login_user_id,
						];
						ChargeOrderDetail::where('charge_order_detail_id', $value['charge_order_detail_id'])->update($update);

						// Update purchase order detail
						if (in_array($value['product_type_id'], [3, 4])) {
							$pod = PurchaseOrderDetail::where('charge_order_detail_id', $value['charge_order_detail_id']);
							$podRow = $pod->first();
							if (!empty($podRow)) {

								$amount = ($podRow->rate ?? 0) * ($value['amount'] ?? 0);

								$pod->update([
									'quantity' => $value['quantity'],
									'amount' => $amount,
									'updated_by' => $request->login_user_id,
									'updated_at' => Carbon::now(),
								]);

								$total = PurchaseOrderDetail::where('purchase_order_id', $podRow->purchase_order_id)
									->selectRaw('SUM(quantity) as total_quantity, SUM(amount) as total_amount')
									->first();

								PurchaseOrder::where('purchase_order_id', $podRow->purchase_order_id)->update([
									'total_quantity' => $total->total_quantity ?? 0,
									'total_amount' => $total->total_amount ?? 0,
									'updated_by' => $request->login_user_id,
									'updated_at' => Carbon::now(),
								]);
							}
						}
					}
					if ($value['row_status'] == 'D') {
						ChargeOrderDetail::where('charge_order_detail_id', $value['charge_order_detail_id'])->delete();
					}
				} catch (\Exception $e) {
					return $this->jsonResponse($e->getMessage(), 500, 'Error');
				}
			}
		}

		$this->updatePicklist($request, $chargeOrder);
		$this->updateServicelist($request, $chargeOrder);


		return $this->jsonResponse(['charge_order_id' => $id], 200, "Update Charge Order Successfully!");
	}




	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'charge_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = ChargeOrder::where('charge_order_id', $id)->first();
		if (!$data) return $this->jsonResponse(['charge_order_id' => $id], 404, "Charge Order Not Found!");

		$validate = [
			'main' => [
				'check' => new ChargeOrder,
				'id' => $id,
			],
			'with' => [
				['model' => new PurchaseOrder],
				['model' => new Picklist],
				['model' => new Servicelist],
				['model' => new Shipment],
			]
		];

		$response = $this->checkAndDelete($validate);
		if ($response['error']) {
			return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
		}


		$data->delete();
		ChargeOrderDetail::where('charge_order_id', $id)->delete();
		return $this->jsonResponse(['charge_order_id' => $id], 200, "Delete Charge Order Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'charge_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->charge_order_ids) && !empty($request->charge_order_ids) && is_array($request->charge_order_ids)) {
				foreach ($request->charge_order_ids as $id) {
					$data = ChargeOrder::where(['charge_order_id' => $id])->first();

					$validate = [
						'main' => [
							'check' => new ChargeOrder,
							'id' => $id,
						],
						'with' => [
							['model' => new PurchaseOrder],
							['model' => new Picklist],
							['model' => new Servicelist],
						]
					];

					$response = $this->checkAndDelete($validate);
					if ($response['error']) {
						return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
					}

					$data->delete();
					ChargeOrderDetail::where('charge_order_id', $id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Charge Order successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
