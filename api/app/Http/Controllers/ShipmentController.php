<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\GRNDetail;
use App\Models\Picklist;
use App\Models\PicklistDetail;
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
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ShipmentController extends Controller
{
	protected $SO_document_type_id = 49;
	protected $db;

	public function index(Request $request)
	{
		$document_identity = $request->input('document_identity', '');
		$charge_no = $request->input('charge_no', '');
		$event_id = $request->input('event_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$customer_id = $request->input('customer_id', '');
		$flag_id = $request->input('flag_id', '');
		$salesman_id = $request->input('salesman_id', '');
		$class1_id = $request->input('class1_id', '');
		$class2_id = $request->input('class2_id', '');
		$imo = $request->input('imo', '');
		$sales_team_ids = $request->input('sales_team_ids', []);
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'shipment.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = Shipment::LeftJoin('event as e', 'e.event_id', '=', 'shipment.event_id')
			->LeftJoin('charge_order as co', 'co.charge_order_id', '=', 'shipment.charge_order_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'e.vessel_id')
			->LeftJoin('flag as f', 'f.flag_id', '=', 'v.flag_id')
			->LeftJoin('customer as c', 'c.customer_id', '=', 'v.customer_id')
			->LeftJoin('class as c1', 'c1.class_id', '=', 'v.class1_id')
			->LeftJoin('class as c2', 'c2.class_id', '=', 'v.class2_id')
			->LeftJoin('salesman as s', 's.salesman_id', '=', 'c.salesman_id')
			->LeftJoin('sales_team as st', 'st.sales_team_id', '=', 'e.sales_team_id');
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
		if (!empty($sales_team_ids) && is_array($sales_team_ids)) {
			$data = $data->whereIn('e.sales_team_id', $sales_team_ids);
		}
		if (!empty($charge_no)) $data = $data->where('co.document_identity', 'like',  "%" . $charge_no . "%");

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
					->OrWhere('st.name', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('co.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select(
			"shipment.*",
			"c.name as customer_name",
			"e.event_code",
			"v.name as vessel_name",
			"v.imo",
			"s.name as salesman_name",
			"f.name as flag_name",
			"c1.name as class1_name",
			"c2.name as class2_name",
			"e.sales_team_id",
			"st.name as sales_team_name",
			"co.document_identity as charge_no"
		);
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);






		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = Shipment::with(
			"shipment_detail.charge_order",
			"shipment_detail.charge_order.agent",
			"shipment_detail.charge_order.port",
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
		$chargeOrders = [];
		$CustomerPos = [];
		$Ports = [];

		foreach ($data->shipment_detail as $detail) {
			if ($detail->product_type_id == 2) {
				$detail->picklist_detail = PicklistDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)->first() ?? null;
				$detail->picklist = Picklist::where('picklist_id', $detail->picklist_detail->picklist_id)->first() ?? null;
			} else if ($detail->product_type_id == 3 || $detail->product_type_id == 4) {
				$detail->purchase_order_detail = PurchaseOrderDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)->first() ?? null;
				$detail->purchase_order = PurchaseOrder::where('purchase_order_id', $detail->purchase_order_detail->purchase_order_id)->first() ?? null;
			}
			$documentIdentity = $detail->charge_order->document_identity ?? null;
			$customerNo = $detail->charge_order->customer_po_no ?? null;
			$port = $detail->charge_order->port->name ?? null;

			if ($documentIdentity !== null) {
				$chargeOrders[] = $documentIdentity;
			}

			if ($customerNo !== null) {
				$CustomerPos[] = $customerNo;
			}
			if ($port !== null) {
				$Ports[] = $port;
			}
		}

		// Remove duplicates
		$data->charge_orders = array_unique($chargeOrders);
		$data->customer_pos = array_unique($CustomerPos);
		$data->ports = array_unique($Ports);

		return $this->jsonResponse($data, 200, "Shipment Data");
	}

	public function Validator($request, $id = null)
	{
		$rules = [
			'event_id' => ['required'],
		];

		$msg = validateRequest($request, $rules);
		if (!empty($msg)) return $msg;
	}

	public function viewBeforeShipment(Request $request)
	{
		if (!isPermission('add', 'shipment', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		$validationErrors = $this->Validator($request->all());
		if ($validationErrors) {
			return $this->jsonResponse($validationErrors, 400, "Request Failed!");
		}

		try {
			$query = ChargeOrderDetail::query()
				->with([
					'charge_order',
					'product',
					'product_type',
					'unit',
					'supplier',
				]);
			$query = $query->whereHas('charge_order', fn($q) => $q->where('event_id', $request->event_id)->where('is_deleted', 0));
			if ($request->charge_order_id) {

				$query = $query->where('charge_order_id', $request->charge_order_id);
			}
			// $query = $query->where('product_type_id', $request->type === "DO" ? '!=' : '=', 1)
			$query = $query->whereRaw('
        (
            SELECT COALESCE(SUM(quantity), 0)
            FROM shipment_detail
            WHERE shipment_detail.charge_order_detail_id = charge_order_detail.charge_order_detail_id
        ) < charge_order_detail.quantity
    ')
				->orderBy('sort_order');

			$chargeOrderDetails = $query->get();

			if ($chargeOrderDetails->isEmpty()) {
				return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");
			}
			// exit;

			$shipmentDetails = $chargeOrderDetails
				->filter(function ($item) {
					$shippedQty = ShipmentDetail::where('charge_order_detail_id', $item->charge_order_detail_id)->sum('quantity');

					return ($this->getPickedQuantity($item, ['addReturnQty' => true]) - $shippedQty) > 0;
				})
				->groupBy('charge_order_id')
				->map(function ($group, $key) {
					$firstItem = $group->first();

					return [
						'charge_order_id' => $key,
						'document_identity' => $firstItem->charge_order?->document_identity,
						'details' => $group->map(function ($item) {
							$shippedQty = ShipmentDetail::where('charge_order_detail_id', $item->charge_order_detail_id)->sum('quantity');
							$remainingQty = $item->quantity - $shippedQty;
							return [
								'charge_order_detail_id' => $item->charge_order_detail_id,
								'product_id' => $item->product_id,
								'product_name' => $item->product?->name ?? $item->product_name,
								'product_type_id' => $item->product_type_id,
								'product_type_name' => $item->product_type?->name,
								'product_description' => $item->product_description,
								'description' => $item->description,
								'internal_notes' => $item->internal_notes,
								'available_quantity' => $this->getPickedQuantity($item, ['addReturnQty' => true]) - $shippedQty,
								'quantity' => $remainingQty,
								'unit_id' => $item->unit_id,
								'unit_name' => $item->unit?->name,
								'supplier_id' => $item->supplier_id,
								'supplier_name' => $item->supplier?->name,
							];
						})->values()->all()
					];
				})->values()->all();

			if (empty($shipmentDetails)) {
				return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");
			}

			return $this->jsonResponse($shipmentDetails, 200, "View Shipment Order");
		} catch (\Exception $e) {
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

		DB::beginTransaction();
		try {
			$createdShipments = [];

			foreach ($request->shipment as $shipmentBlock) {
				$uuid = $this->get_uuid();

				$document = DocumentType::getNextDocument(
					$this->SO_document_type_id,
					$request
				);

				// Insert Shipment Header
				$shipmentInsert = [
					'company_id'        => $request->company_id ?? "",
					'company_branch_id' => $request->company_branch_id ?? "",
					'shipment_id'       => $uuid,
					'document_type_id'  => $document['document_type_id'] ?? "",
					'document_no'       => $document['document_no'] ?? "",
					'document_identity' => $shipmentBlock['document_identity'] ?? $document['document_identity'] ?? "",
					'document_prefix'   => $document['document_prefix'] ?? "",
					'document_date'     => Carbon::now(),
					'event_id'          => $request->event_id ?? "",
					'charge_order_id'   => $shipmentBlock['charge_order_id'] ?? "",
					'created_at'        => Carbon::now(),
					'created_by'        => $request->login_user_id,
				];
				Shipment::create($shipmentInsert);

				$chargeOrderDetailIds = collect($shipmentBlock['details'])->pluck('charge_order_detail_id')->toArray();

				$chargeOrderDetails = ChargeOrderDetail::whereHas('charge_order', function ($query) use ($request, $shipmentBlock) {
					$query->where('event_id', $request->event_id)
						->where('charge_order_id', $shipmentBlock['charge_order_id']);
				})
					->whereIn('charge_order_detail_id', $chargeOrderDetailIds)
					->whereRaw('
                (
                    SELECT COALESCE(SUM(quantity), 0)
                    FROM shipment_detail
                    WHERE shipment_detail.charge_order_detail_id = charge_order_detail.charge_order_detail_id
                ) < charge_order_detail.quantity
            ')
					->orderBy('sort_order')
					->get();

				if ($chargeOrderDetails->isEmpty()) {
					continue; 
				}

				$shipmentDetails = [];
				foreach ($chargeOrderDetails as $index => $detail) {
					$shippedQty = ShipmentDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)->sum('quantity');

					if (($this->getPickedQuantity($detail, ['addReturnQty' => true]) - $shippedQty) > 0) {
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
							'quantity'              => $this->getPickedQuantity($detail, ['addReturnQty' => true]) - $shippedQty,
							'unit_id'               => $detail->unit_id,
							'supplier_id'           => $detail->supplier_id,
							'created_at'            => Carbon::now(),
							'created_by'            => $request->login_user_id,
						];
					}
				}

				if (!empty($shipmentDetails)) {
					ShipmentDetail::insert($shipmentDetails);

					// Optional: update charge order details with shipment reference
					ChargeOrderDetail::whereIn('charge_order_detail_id', $chargeOrderDetailIds)
						->update([
							'shipment_id' => $uuid,
							'shipment_detail_id' => $this->get_uuid()
						]);

					$createdShipments[] = $uuid;
				}
			}

			if (empty($createdShipments)) {
				DB::rollBack();
				return $this->jsonResponse('No Valid Shipment Orders Created', 404, "No Data Found!");
			}

			DB::commit();
			return $this->jsonResponse(['shipment_ids' => $createdShipments], 200, "Shipment Orders Created Successfully!");
		} catch (\Exception $e) {
			DB::rollBack();
			Log::error('Shipment Store Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while saving Shipment.", 500, "Transaction Failed");
		}
	}


	// public function store(Request $request)
	// {
	// 	if (!isPermission('add', 'shipment', $request->permission_list)) {
	// 		return $this->jsonResponse('Permission Denied!', 403, "No Permission");
	// 	}

	// 	// Validate Request
	// 	$isError = $this->Validator($request->all());
	// 	if (!empty($isError)) {
	// 		return $this->jsonResponse($isError, 400, "Request Failed!");
	// 	}
	// 	DB::beginTransaction();
	// 	try {
	// 		$uuid = $this->get_uuid();
	// 		$document = DocumentType::getNextDocument(
	// 			$this->SO_document_type_id,
	// 			$request
	// 		);

	// 		// Shipment Insert Array
	// 		$shipmentInsert = [
	// 			'company_id'        => $request->company_id ?? "",
	// 			'company_branch_id' => $request->company_branch_id ?? "",
	// 			'shipment_id'       => $uuid,
	// 			'document_type_id'  => $document['document_type_id'] ?? "",
	// 			'document_no'       => $document['document_no'] ?? "",
	// 			'document_identity' => $document['document_identity'] ?? "",
	// 			'document_prefix'   => $document['document_prefix'] ?? "",
	// 			'document_date'     => Carbon::now(),
	// 			'event_id'          => $request->event_id ?? "",
	// 			'charge_order_id'   => $request->charge_order_id ?? "",
	// 			'created_at'        => Carbon::now(),
	// 			'created_by'        => $request->login_user_id,
	// 		];

	// 		// Extract charge order details from the request
	// 		$chargeOrderIds = collect($request->shipment)->pluck('charge_order_id')->unique()->toArray();
	// 		$chargeOrderDetailIds = collect($request->shipment)->pluck('details')->flatten(1)->pluck('charge_order_detail_id')->unique()->values()->toArray();

	// 		// Fetch valid charge order details from DB
	// 		$chargeOrderDetails = ChargeOrderDetail::whereHas('charge_order', function ($query) use ($request, $chargeOrderIds) {
	// 			$query->where('event_id', $request->event_id)
	// 				->whereIn('charge_order_id', $chargeOrderIds);
	// 		})
	// 			->whereIn('charge_order_detail_id', $chargeOrderDetailIds)
	// 			// ->when($request->type == "DO", fn($query) => $query->where('product_type_id', '!=', 1), fn($query) => $query->where('product_type_id', 1))
	// 			->whereRaw('
	//     (
	//         SELECT COALESCE(SUM(quantity), 0)
	//         FROM shipment_detail
	//         WHERE shipment_detail.charge_order_detail_id = charge_order_detail.charge_order_detail_id
	//     ) < charge_order_detail.quantity
	// 	')

	// 			->orderBy('sort_order')
	// 			->get();
	// 		if ($chargeOrderDetails->isEmpty()) {
	// 			return $this->jsonResponse('No Items Found For Shipment', 404, "No Data Found!");
	// 		}
	// 		// Process Shipment Details
	// 		$shipmentDetails = [];
	// 		foreach ($chargeOrderDetails as $index => $detail) {
	// 			$shippedQty = ShipmentDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)->sum('quantity');

	// 			if (($this->getPickedQuantity($detail, ['addReturnQty' => true]) - $shippedQty) > 0) {
	// 				$shipmentDetails[] = [
	// 					'shipment_id'           => $uuid,
	// 					'shipment_detail_id'    => $this->get_uuid(),
	// 					'sort_order'            => $index + 1,
	// 					'charge_order_id'       => $detail->charge_order_id,
	// 					'charge_order_detail_id' => $detail->charge_order_detail_id,
	// 					'product_id'            => $detail->product_id,
	// 					'product_type_id'       => $detail->product_type_id,
	// 					'product_name'          => $detail->product_name,
	// 					'product_description'   => $detail->product_description,
	// 					'description'           => $detail->description,
	// 					'internal_notes'        => $detail->internal_notes,
	// 					'quantity'              => $this->getPickedQuantity($detail, ['addReturnQty' => true]) - $shippedQty,
	// 					'unit_id'               => $detail->unit_id,
	// 					'supplier_id'           => $detail->supplier_id,
	// 					'created_at'            => Carbon::now(),
	// 					'created_by'            => $request->login_user_id,
	// 				];
	// 			}
	// 		}

	// 		if (empty($shipmentDetails)) {
	// 			return $this->jsonResponse('No Valid Shipment Details Found', 404, "No Data Found!");
	// 		}

	// 		// Insert Shipment & Details (Batch Insert for Performance)
	// 		Shipment::create($shipmentInsert);
	// 		ShipmentDetail::insert($shipmentDetails);

	// 		// Update `ChargeOrderDetail` with Shipment Info
	// 		ChargeOrderDetail::whereIn('charge_order_detail_id', $chargeOrderDetailIds)
	// 			->update([
	// 				'shipment_id' => $uuid,
	// 				'shipment_detail_id' => $this->get_uuid()
	// 			]);
	// 		DB::commit();
	// 		return $this->jsonResponse(['shipment_id' => $uuid], 200, "Create Shipment Order Successfully!");
	// 	} catch (\Exception $e) {
	// 		DB::rollBack(); // Rollback on error
	// 		Log::error('Shipment Store Error: ' . $e->getMessage());
	// 		return $this->jsonResponse("Something went wrong while saving Shipment.", 500, "Transaction Failed");
	// 	}
	// }



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
