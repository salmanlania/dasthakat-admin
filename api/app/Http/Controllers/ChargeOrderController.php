<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use App\Models\Quotation;
use App\Models\StockLedger;
use App\Models\Supplier;
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

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('c.name', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
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
			"agent"
		)
			->where('charge_order_id', $id)->first();

		if ($data) {
			foreach ($data->charge_order_detail as $detail) {
				if ($detail->product) {
					$detail->product->stock = StockLedger::Check($detail->product, $request->all());
				}
				if (!empty($detail->purchase_order_detail_id)) $detail->editable = false;
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


	public function getVendorWiseDetails($id)
	{
		$record = ChargeOrder::with(['charge_order_detail', 'charge_order_detail.product'])
			->where('charge_order_id', $id)
			->firstOrFail();

		$filteredDetails = collect($record->charge_order_detail)->filter(
			fn($row) => (($row->product_type_id == 4 || $row->product_type_id == 3) && empty($row->purchase_order_detail_id))
		);

		$vendorWiseDetails = $filteredDetails->groupBy('supplier_id')->map(function ($items, $supplierId) {
			return [
				"supplier_id" => $supplierId,
				"supplier_name" => optional($items->first()->supplier)->name ?? "Unknown Supplier",
				// "total_quantity" => $items->sum('quantity'),
				// "total_amount" => $items->sum(fn($item) => $item->quantity * $item->cost_price),
				// "items" => $items->map(function ($item) {
				// 	return [
				// 		"charge_order_detail_id" => $item->charge_order_detail_id,
				// 		"product_id" => $item->product_id,
				// 		"product_name" => $item->product_type_id == 3 ? $item->product->name : $item->product_name ?? null,
				// 		"quantity" => $item->quantity,
				// 		"cost_price" => $item->cost_price,
				// 		"amount" => $item->quantity * $item->cost_price,
				// 	];
				// })->values(),
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

			// Fetch charge order details using charge_order_id and supplier_id
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
			// Create Purchase Order
			$purchaseOrder = [
				'company_id'        => $request->company_id,
				'company_branch_id' => $request->company_branch_id,
				'purchase_order_id' => $uuid,
				'charge_order_id'   => $chargeOrderId ?? "", // Linking Charge Order ID
				'quotation_id'   => $Quotation->quotation_id ?? "", // Linking Charge Order ID
				'document_type_id'  => $document['document_type_id'] ?? null,
				'document_no'       => $document['document_no'] ?? null,
				'document_prefix'   => $document['document_prefix'] ?? null,
				'document_identity' => $document['document_identity'] ?? null,
				'document_date'     => Carbon::now(),
				'supplier_id'       => $supplierId,
				'payment_id'       => $vendorDetails['payment_id'] ?? null,
				'type'              => "Buyout",
				'buyer_id'          => $request->login_user_id,
				'total_quantity'    => $totalQuantity,
				'total_amount'      => $totalAmount,
				'required_date'     => $requiredDate ?? null,
				'ship_via'          => $shipVia ?? null,
				'ship_to'           => $shipTo ?? null,
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
					'sort_order'               => $index,
					'product_id'               => $detail->product_id ?? null,
					'product_type_id'          => $detail->product_type_id ?? null,
					'product_name'             => $detail->product_name ?? null,
					'product_description'      => $detail->product_description ?? null,
					'description'              => $detail->description ?? null,
					'unit_id'                  => $detail->unit_id ?? null,
					'quantity'                 => $detail->quantity ?? null,
					'rate'                     => $detail->cost_price ?? null,
					'amount'                   => ($detail->quantity ?? 0) * ($detail->cost_price ?? 0),
					'created_at'               => Carbon::now(),
					'created_by'               => $request->login_user_id,
				];

				PurchaseOrderDetail::insert($purchaseOrderDetail);

				// Update Charge Order Details with Purchase Order ID
				ChargeOrderDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)
					->update([
						'purchase_order_id'        => $uuid,
						'purchase_order_detail_id' => $purchase_order_detail_id,
					]);
			}
		}

		return $this->jsonResponse(null, 200, "Purchase Orders Created Successfully.");
	}


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
			'remarks' => $request->remarks ?? "",
			'total_quantity' => $request->total_quantity ?? "",
			'total_amount' => $request->total_amount ?? 0,
			'discount_amount' => $request->discount_amount ?? 0,
			'net_amount' => $request->net_amount ?? 0,
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		ChargeOrder::create($insertArr);

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
					'quantity' => $value['quantity'] ?? "",
					'cost_price' => $value['cost_price'] ?? "",
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


		return $this->jsonResponse(['charge_order_id' => $uuid], 200, "Add Charge Order Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'charge_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->Validator($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = ChargeOrder::where('charge_order_id', $id)->first();
		$data->company_id = $request->company_id;
		$data->company_branch_id = $request->company_branch_id;
		$data->document_date = $request->document_date;
		$data->salesman_id = $request->salesman_id;
		$data->customer_po_no = $request->customer_po_no;
		$data->customer_id = $request->customer_id;
		$data->event_id = $request->event_id;
		$data->vessel_id = $request->vessel_id;
		$data->flag_id = $request->flag_id;
		$data->class1_id = $request->class1_id;
		$data->class2_id = $request->class2_id;
		$data->agent_id = $request->agent_id;
		$data->remarks = $request->remarks;
		$data->total_quantity = $request->total_quantity;
		$data->total_amount = $request->total_amount;
		$data->discount_amount = $request->discount_amount;
		$data->net_amount = $request->net_amount;
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;
		$data->update();
		ChargeOrderDetail::where('charge_order_id', $id)->delete();
		if ($request->charge_order_detail) {

			foreach ($request->charge_order_detail as $key => $value) {
				$detail_uuid = $this->get_uuid();

				$insertArr = [
					'charge_order_id' => $id,
					'charge_order_detail_id' => $detail_uuid,
					'sort_order' => $value['sort_order'] ?? "",
					'product_code' => $value['product_code'] ?? "",
					'purchase_order_id' => $value['purchase_order_id'] ?? "",
					'purchase_order_detail_id' => $value['purchase_order_detail_id'] ?? "",
					'picklist_id' => $value['picklist_id'] ?? "",
					'picklist_detail_id' => $value['picklist_detail_id'] ?? "",
					'servicelist_id' => $value['servicelist_id'] ?? "",
					'quotation_detail_id' => $value['quotation_detail_id'] ?? "",
					'servicelist_detail_id' => $value['servicelist_detail_id'] ?? "",
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
					'cost_price' => $value['cost_price'] ?? "",
					'rate' => $value['rate'] ?? "",
					'amount' => $value['amount'] ?? "",
					'discount_amount' => $value['discount_amount'] ?? "",
					'discount_percent' => $value['discount_percent'] ?? "",
					'gross_amount' => $value['gross_amount'] ?? "",
					'created_at' => date('Y-m-d H:i:s'),
					'created_by' => $request->login_user_id,
				];
				ChargeOrderDetail::create($insertArr);
			}
		}


		return $this->jsonResponse(['charge_order_id' => $id], 200, "Update Charge Order Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'charge_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = ChargeOrder::where('charge_order_id', $id)->first();
		if (!$data) return $this->jsonResponse(['charge_order_id' => $id], 404, "Charge Order Not Found!");
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
				foreach ($request->charge_order_ids as $charge_order_id) {
					$user = ChargeOrder::where(['charge_order_id' => $charge_order_id])->first();
					$user->delete();
					ChargeOrderDetail::where('charge_order_id', $charge_order_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Charge Order successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
