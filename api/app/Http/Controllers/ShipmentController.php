<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\GRNDetail;
use App\Models\PicklistReceived;
use App\Models\PicklistReceivedDetail;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use App\Models\Quotation;
use App\Models\ServicelistReceivedDetail;
use App\Models\Shipment;
use App\Models\ShipmentDetail;
use App\Models\StockLedger;
use App\Models\Supplier;
use App\Models\Technician;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use PDO;

class ShipmentController extends Controller
{
	protected $DO_document_type_id = 48;
	protected $SO_document_type_id = 49;
	protected $db;

	public function index(Request $request)
	{
		$document_identity = $request->input('document_identity', '');
		$event_id = $request->input('event_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$customer_id = $request->input('customer_id', '');
		$flag_id = $request->input('flag_id', '');
		$salesman_id = $request->input('salesman_id', '');
		$class1_id = $request->input('class1_id', '');
		$class2_id = $request->input('class2_id', '');
		$imo = $request->input('imo', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'shipment.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = Shipment::LeftJoin('event as e', 'e.event_id', '=', 'shipment.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'e.vessel_id')
			->LeftJoin('flag as f', 'f.flag_id', '=', 'v.flag_id')
			->LeftJoin('customer as c', 'c.customer_id', '=', 'v.customer_id')
			->LeftJoin('class as c1', 'c1.class_id', '=', 'v.class1_id')
			->LeftJoin('class as c2', 'c2.class_id', '=', 'v.class2_id')
			->LeftJoin('salesman as s', 's.salesman_id', '=', 'c.salesman_id');
		$data = $data->where('shipment.company_id', '=', $request->company_id);
		$data = $data->where('shipment.company_branch_id', '=', $request->company_branch_id);
		if (!empty($document_identity)) $data = $data->where('shipment.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($event_id)) $data = $data->where('shipment.event_id', '=',  $event_id);
		if (!empty($flag_id)) $data = $data->where('v.flag_id', '=',  $flag_id);
		if (!empty($vessel_id)) $data = $data->where('v.vessel_id', '=',  $vessel_id);
		if (!empty($salesman_id)) $data = $data->where('s.salesman_id', '=',  $salesman_id);
		if (!empty($customer_id)) $data = $data->where('c.customer_id', '=',  $customer_id);
		if (!empty($imo)) $data = $data->where('v.imo', 'like',  "%" . $imo . "%");
		if (!empty($class1_id)) $data = $data->where('v.class1_id', '=',  $class1_id);
		if (!empty($class2_id)) $data = $data->where('v.class2_id', '=',  $class2_id);
		if (!empty($document_date)) $data = $data->where('shipment.document_date', '=',  $document_date);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->OrWhere('shipment.document_identity', 'like', '%' . $search . '%')
					->OrWhere('v.imo', 'like', '%' . $search . '%')
					->OrWhere('f.name', 'like', '%' . $search . '%')
					->OrWhere('c1.name', 'like', '%' . $search . '%')
					->OrWhere('c2.name', 'like', '%' . $search . '%')
					->OrWhere('c.name', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('s.name', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("shipment.*", "c.name as customer_name", "e.event_code", "v.name as vessel_name", "v.imo", "s.name as salesman_name", "f.name as flag_name", "c1.name as class1_name", "c2.name as class2_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);






		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = Shipment::with(
			"shipment_detail",
			"shipment_detail.charge_order",
			"shipment_detail.charge_order_detail",
			"shipment_detail.product",
			"shipment_detail.product_type",
			"shipment_detail.unit",
			"shipment_detail.supplier",
			"event",
			"charge_order",
			"charge_order.agent",
			"event.vessel",
			"event.customer",
			"event.class1",
			"event.class2",
			"event.customer.salesman",
			"event.vessel.flag"
		)
			->where('shipment_id', $id)->first();

		return $this->jsonResponse($data, 200, "Shipment Data");
	}

	public function Validator($request, $id = null)
	{
		$rules = [
			'event_id' => ['required'],
			'type' => ['required'],
		];

		$msg = validateRequest($request, $rules);
		if (!empty($msg)) return $msg;
	}

	public function viewBeforeShipment(Request $request)
	{
		// Early permission check
		if (!isPermission('add', 'shipment', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		// Validate request early
		$validationErrors = $this->Validator($request->all());
		if ($validationErrors) {
			return $this->jsonResponse($validationErrors, 400, "Request Failed!");
		}

		try {
			// Build query with optimized relationships and conditions
			$query = ChargeOrderDetail::query()
				->with([
					'charge_order',
					'product',
					'product_type',
					'unit',
					'supplier',
				]);
			$query = $query->whereHas('charge_order', fn($q) => $q->where('event_id', $request->event_id));
			if ($request->charge_order_id) {

				$query = $query->where('charge_order_id', $request->charge_order_id);
			}
			// ->when($request->charge_order_id, fn($q) => $q->where('charge_order_id', $request->charge_order_id))
			$query = $query->where('product_type_id', $request->type === "DO" ? '!=' : '=', 1)
				->where('shipment_detail_id', "")
				->orderBy('sort_order');

			$chargeOrderDetails = $query->get();
			// return $this->jsonResponse($chargeOrderDetails, , "View Shipment Order");

			if ($chargeOrderDetails->isEmpty()) {
				return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");
			}
			// exit;

			// Use collection methods for transformation
			$shipmentDetails = $chargeOrderDetails
				->filter(fn($item) => $this->getPickedQuantity($item) > 0)
				->groupBy('charge_order_id')
				->map(function ($group, $key) {
					$firstItem = $group->first();
					return [
						'charge_order_id' => $key,
						'document_identity' => $firstItem->charge_order?->document_identity,
						'details' => $group->map(fn($item) => [
							'charge_order_detail_id' => $item->charge_order_detail_id,
							'product_id' => $item->product_id,
							'product_name' => $item->product?->name ?? $item->product_name,
							'product_type_id' => $item->product_type_id,
							'product_type_name' => $item->product_type?->name,
							'product_description' => $item->product_description,
							'description' => $item->description,
							'internal_notes' => $item->internal_notes,
							'available_quantity' => $this->getPickedQuantity($item),
							'quantity' => $item->quantity,
							'unit_id' => $item->unit_id,
							'unit_name' => $item->unit?->name,
							'supplier_id' => $item->supplier_id,
							'supplier_name' => $item->supplier?->name,
						])->values()->all()
					];
				})->values()->all();

			if (empty($shipmentDetails)) {
				return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");
			}

			return $this->jsonResponse($shipmentDetails, 200, "View Shipment Order");
		} catch (\Exception $e) {
			// Add proper error handling
			return $this->jsonResponse('An error occurred while processing the request', 500, $e->getMessage());
		}
	}

	public function store(Request $request)
	{
		if (!isPermission('add', 'shipment', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		// Validate Request
		$isError = $this->Validator($request->all());
		if (!empty($isError)) {
			return $this->jsonResponse($isError, 400, "Request Failed!");
		}

		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument(
			$request->type == "DO" ? $this->DO_document_type_id : $this->SO_document_type_id,
			$request
		);

		// Shipment Insert Array
		$shipmentInsert = [
			'company_id'        => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'shipment_id'       => $uuid,
			'document_type_id'  => $document['document_type_id'] ?? "",
			'document_no'       => $document['document_no'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_prefix'   => $document['document_prefix'] ?? "",
			'document_date'     => Carbon::now(),
			'event_id'          => $request->event_id ?? "",
			'charge_order_id'   => $request->charge_order_id ?? "",
			'created_at'        => Carbon::now(),
			'created_by'        => $request->login_user_id,
		];

		// Extract charge order details from the request
		$chargeOrderIds = collect($request->shipment)->pluck('charge_order_id')->unique()->toArray();
		$chargeOrderDetailIds = collect($request->shipment)->pluck('details')->flatten(1)->pluck('charge_order_detail_id')->unique()->values()->toArray();

		// Fetch valid charge order details from DB
		$chargeOrderDetails = ChargeOrderDetail::whereHas('charge_order', function ($query) use ($request, $chargeOrderIds) {
			$query->where('event_id', $request->event_id)
				->whereIn('charge_order_id', $chargeOrderIds);
		})
			->whereIn('charge_order_detail_id', $chargeOrderDetailIds)
			->when($request->type == "DO", fn($query) => $query->where('product_type_id', '!=', 1), fn($query) => $query->where('product_type_id', 1))
			->where('shipment_detail_id', "")
			->orderBy('sort_order')
			->get();
		if ($chargeOrderDetails->isEmpty()) {
			return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");
		}
		// Process Shipment Details
		$shipmentDetails = [];
		foreach ($chargeOrderDetails as $index => $detail) {
			if ($this->getPickedQuantity($detail) > 0) {
				$shipmentDetails[] = [
					'shipment_id'           => $uuid,
					'shipment_detail_id'    => $this->get_uuid(),
					'sort_order'            => $index + 1,
					'charge_order_id'       => $detail->charge_order_id,
					'charge_order_detail_id' => $detail->charge_order_detail_id,
					'product_id'            => $detail->product_id,
					'product_type_id'       => $detail->product_type_id,
					'product_name'          => $detail->product_name,
					'product_description'   => $detail->product_description,
					'description'           => $detail->description,
					'internal_notes'        => $detail->internal_notes,
					'quantity'              => $this->getPickedQuantity($detail),
					'unit_id'               => $detail->unit_id,
					'supplier_id'           => $detail->supplier_id,
					'created_at'            => Carbon::now(),
					'created_by'            => $request->login_user_id,
				];
			}
		}

		if (empty($shipmentDetails)) {
			return $this->jsonResponse('No Valid Shipment Details Found', 404, "No Data Found!");
		}

		// Insert Shipment & Details (Batch Insert for Performance)
		Shipment::create($shipmentInsert);
		ShipmentDetail::insert($shipmentDetails);

		// Update `ChargeOrderDetail` with Shipment Info
		ChargeOrderDetail::whereIn('charge_order_detail_id', $chargeOrderDetailIds)
			->update([
				'shipment_id' => $uuid,
				'shipment_detail_id' => $this->get_uuid()
			]);

		return $this->jsonResponse(['shipment_id' => $uuid], 200, "Create Shipment Order Successfully!");
	}



	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'shipment', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = Shipment::where('shipment_id', $id)->first();
		if (!$data) return $this->jsonResponse(['shipment_id' => $id], 404, "Shipment Order Not Found!");

		ChargeOrderDetail::where('shipment_id', $id)
			->update([
				'shipment_id' => null,
				'shipment_detail_id' => null,
			]);

		$data->delete();
		ShipmentDetail::where('shipment_id', $id)->delete();

		return $this->jsonResponse(['shipment_id' => $id], 200, "Delete Shipment Order Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'shipment', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->shipment_ids) && !empty($request->shipment_ids) && is_array($request->shipment_ids)) {
				foreach ($request->shipment_ids as $shipment_id) {
					$data = Shipment::where(['shipment_id' => $shipment_id])->first();
					ChargeOrderDetail::where('shipment_id', $shipment_id)
						->update([
							'shipment_id' => null,
							'shipment_detail_id' => null,
						]);
					$data->delete();
					ShipmentDetail::where('shipment_id', $shipment_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Shipment Order successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
