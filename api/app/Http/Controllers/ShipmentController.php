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

	// public function viewBeforeShipment(Request $request)
	// {

	// 	if (!isPermission('add', 'shipment', $request->permission_list))
	// 		return $this->jsonResponse('Permission Denied!', 403, "No Permission");

	// 	// Validation Rules
	// 	$isError = $this->Validator($request->all());
	// 	if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

	// 	$chargeOrderDetails = ChargeOrderDetail::with('product', 'product_type', 'unit', 'supplier')->whereHas('charge_order', function ($query) use ($request) {
	// 		$query->where('event_id', $request->event_id);
	// 	})->where('shipment_detail_id', null);
	// 	if (!empty($request->charge_order_id)) {
	// 		$chargeOrderDetails = $chargeOrderDetails->where('charge_order_id', $request->charge_order_id);
	// 	}
	// 	if ($request->type == "DO") {
	// 		$chargeOrderDetails = $chargeOrderDetails->where('product_type_id', '!=', 1);
	// 	} else {
	// 		$chargeOrderDetails = $chargeOrderDetails->where('product_type_id', 1);
	// 	}

	// 	$chargeOrderDetails = $chargeOrderDetails->orderBy('sort_order')->get();

	// 	if ($chargeOrderDetails->isEmpty()) return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");


	// 	$shipmentDetails = [];
	// 	foreach ($chargeOrderDetails as $key => $value) {

	// 		if ($value->product_type_id == 1) {
	// 			$quantity = ServicelistReceivedDetail::join('servicelist_received', 'servicelist_received_detail.servicelist_received_id', '=', 'servicelist_received.servicelist_received_id')
	// 				->join('servicelist', 'servicelist_received.servicelist_id', '=', 'servicelist.servicelist_id')
	// 				->where('servicelist.charge_order_id', $value->charge_order_id)
	// 				->where('servicelist_received_detail.product_id', $value->product_id)
	// 				->sum('servicelist_received_detail.quantity');
	// 		}
	// 		if ($value->product_type_id == 2) {
	// 			$quantity = PicklistReceivedDetail::join('picklist_received', 'picklist_received_detail.picklist_received_id', '=', 'picklist_received.picklist_received_id')
	// 				->join('picklist', 'picklist_received.picklist_id', '=', 'picklist.picklist_id')
	// 				->where('picklist.charge_order_id', $value->charge_order_id)
	// 				->where('picklist_received_detail.product_id', $value->product_id)
	// 				->sum('picklist_received_detail.quantity');
	// 		}
	// 		if ($value->product_type_id == 3 || $value->product_type_id == 4) {
	// 			$quantity = GRNDetail::join('purchase_order_detail as pod', 'good_received_note_detail.purchase_order_detail_id', '=', 'pod.purchase_order_detail_id')
	// 				->join('purchase_order as po', 'pod.purchase_order_id', '=', 'po.purchase_order_id')
	// 				->where('po.charge_order_id', $value->charge_order_id);

	// 			if ($value->product_type_id == 4) {
	// 				$quantity->where('good_received_note_detail.product_name', $value->product_name);
	// 			} else {
	// 				$quantity->where('good_received_note_detail.product_id', $value->product_id);
	// 			}

	// 			$quantity = $quantity->sum('good_received_note_detail.quantity');
	// 		}

	// 		if ($quantity > 0) {
	// 			$shipmentDetails[] = [
	// 				'shipment_id' => $value->charge_order_id ?? null,
	// 				'shipment_detail_id' => $value->charge_order_detail_id ?? null,
	// 				'product_id' => $value->product_id ?? null,
	// 				'product_name' => $value->product->name ?? $value->product_name ?? null,
	// 				'product_type_id' => $value->product_type_id ?? null,
	// 				'product_type_name' => $value->product_type->name ?? null,
	// 				'product_description' => $value->product_description ?? null,
	// 				'description' => $value->description ?? null,
	// 				'internal_notes' => $value->internal_notes ?? null,
	// 				'quantity' => $quantity,
	// 				'unit_id' => $value->unit_id ?? null,
	// 				'unit_name' => $value->unit->name ?? null,
	// 				'supplier_id' => $value->supplier_id ?? null,
	// 				'supplier_name' => $value->supplier->name ?? null,
	// 			];
	// 		}
	// 	}
	// 	if (empty($shipmentDetails)) {
	// 		return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");
	// 	}

	// 	return $this->jsonResponse($shipmentDetails, 200, "View Shipment Order");
	// }

	public function viewBeforeShipment(Request $request)
	{
		if (!isPermission('add', 'shipment', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		$isError = $this->Validator($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$chargeOrderDetails = ChargeOrderDetail::with('product', 'product_type', 'unit', 'supplier')
			->whereHas('charge_order', fn($query) => $query->where('event_id', $request->event_id))
			->whereNull('shipment_detail_id');

		if (!empty($request->charge_order_id)) {
			$chargeOrderDetails->where('charge_order_id', $request->charge_order_id);
		}

		$chargeOrderDetails->where('product_type_id', $request->type == "DO" ? '!=' : '=', 1);
		$chargeOrderDetails = $chargeOrderDetails->orderBy('sort_order')->get();

		if ($chargeOrderDetails->isEmpty()) {
			return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");
		}

		$shipmentDetails = [];
		foreach ($chargeOrderDetails as $value) {
			$quantity = $this->getShipmentQuantity($value);


			if ($quantity > 0) {
				$shipmentDetails[$value->charge_order_id][] = [
					'shipment_detail_id' => $value->charge_order_detail_id ?? null,
					'product_id' => $value->product_id ?? null,
					'product_name' => $value->product->name ?? $value->product_name ?? null,
					'product_type_id' => $value->product_type_id ?? null,
					'product_type_name' => $value->product_type->name ?? null,
					'product_description' => $value->product_description ?? null,
					'description' => $value->description ?? null,
					'internal_notes' => $value->internal_notes ?? null,
					'quantity' => $quantity,
					'unit_id' => $value->unit_id ?? null,
					'unit_name' => $value->unit->name ?? null,
					'supplier_id' => $value->supplier_id ?? null,
					'supplier_name' => $value->supplier->name ?? null,
				];
			}
		}

		if (empty($shipmentDetails)) {
			return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");
		}

		return $this->jsonResponse($shipmentDetails, 200, "View Shipment Order");
	}

	public function store(Request $request)
	{


		if (!isPermission('add', 'shipment', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->Validator($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($request->type == "DO" ? $this->DO_document_type_id : $this->SO_document_type_id, $request);
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'shipment_id' => $uuid,
			'document_type_id' => $document['document_type_id'] ?? "",
			'document_no' => $document['document_no'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_prefix' => $document['document_prefix'] ?? "",
			'document_date' => Carbon::now(),
			'event_id' => $request->event_id ?? "",
			'charge_order_id' => $request->charge_order_id ?? "",
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		];

		$chargeOrderIds = array_keys($request->shipment);


		$chargeOrderDetails = ChargeOrderDetail::whereHas('charge_order', function ($query) use ($request, $chargeOrderIds) {
			$query->where('event_id', $request->event_id);
			$query->whereIn('charge_order_id', $chargeOrderIds);
		})->where('shipment_detail_id', null);
		if (!empty($request->charge_order_id)) {
			$chargeOrderDetails = $chargeOrderDetails->where('charge_order_id', $request->charge_order_id);
		}
		if ($request->type == "DO") {
			$chargeOrderDetails = $chargeOrderDetails->where('product_type_id', '!=', 1);
		} else {
			$chargeOrderDetails = $chargeOrderDetails->where('product_type_id', 1);
		}

		$chargeOrderDetails = $chargeOrderDetails->orderBy('sort_order')->get();

		if ($chargeOrderDetails->isEmpty()) return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");


		$shipmentDetails = [];
		foreach ($chargeOrderDetails as $key => $value) {
			if ($request->shipment[$value->charge_order_id]['product_id'] != $value->product_id) {
				continue;
			}
			$quantity = $this->getShipmentQuantity($value);

			if ($quantity > 0) {
				$shipmentDetails[] = [
					'shipment_id' => $uuid,
					'shipment_detail_id' => $this->get_uuid(),
					'sort_order' => $key + 1,
					'charge_order_id' => $value->charge_order_id ?? null,
					'charge_order_detail_id' => $value->charge_order_detail_id ?? null,
					'product_id' => $value->product_id ?? null,
					'product_type_id' => $value->product_type_id ?? null,
					'product_name' => $value->product_name ?? null,
					'product_description' => $value->product_description ?? null,
					'description' => $value->description ?? null,
					'internal_notes' => $value->internal_notes ?? null,
					'quantity' => $quantity,
					'unit_id' => $value->unit_id ?? null,
					'supplier_id' => $value->supplier_id ?? null,
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id,
				];
			}
		}
		if (empty($shipmentDetails)) {
			return $this->jsonResponse('No Valid Shipment Details Found', 404, "No Data Found!");
		}
		Shipment::create($insertArr);
		foreach ($shipmentDetails as $detail) {
			ShipmentDetail::create($detail);
			ChargeOrderDetail::where('charge_order_detail_id', $detail['charge_order_detail_id'])
				->update(['shipment_id' => $detail['shipment_id'], 'shipment_detail_id' => $detail['shipment_detail_id']]);
		}


		return $this->jsonResponse(['shipment_id' => $uuid], 200, "Create Shipment Order Successfully!");
	}

	/**
	 * Get shipment quantity based on product type.
	 */
	private function getShipmentQuantity($chargeOrderDetail)
	{
		return match ($chargeOrderDetail->product_type_id) {
			1 => ServicelistReceivedDetail::join('servicelist_received', 'servicelist_received_detail.servicelist_received_id', '=', 'servicelist_received.servicelist_received_id')
				->join('servicelist', 'servicelist_received.servicelist_id', '=', 'servicelist.servicelist_id')
				->where('servicelist.charge_order_id', $chargeOrderDetail->charge_order_id)
				->where('servicelist_received_detail.product_id', $chargeOrderDetail->product_id)
				->sum('servicelist_received_detail.quantity'),

			2 => PicklistReceivedDetail::join('picklist_received', 'picklist_received_detail.picklist_received_id', '=', 'picklist_received.picklist_received_id')
				->join('picklist', 'picklist_received.picklist_id', '=', 'picklist.picklist_id')
				->where('picklist.charge_order_id', $chargeOrderDetail->charge_order_id)
				->where('picklist_received_detail.product_id', $chargeOrderDetail->product_id)
				->sum('picklist_received_detail.quantity'),

			3, 4 => GRNDetail::join('purchase_order_detail as pod', 'good_received_note_detail.purchase_order_detail_id', '=', 'pod.purchase_order_detail_id')
				->join('purchase_order as po', 'pod.purchase_order_id', '=', 'po.purchase_order_id')
				->where('po.charge_order_id', $chargeOrderDetail->charge_order_id)
				->when(
					$chargeOrderDetail->product_type_id == 4,
					fn($q) => $q->where('good_received_note_detail.product_name', $chargeOrderDetail->product_name),
					fn($q) => $q->where('good_received_note_detail.product_id', $chargeOrderDetail->product_id)
				)
				->sum('good_received_note_detail.quantity'),

			default => 0
		};
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
