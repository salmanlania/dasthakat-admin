<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Event;
use App\Models\EventDispatch;
use App\Models\GRNDetail;
use App\Models\JobOrder;
use App\Models\Picklist;
use App\Models\PicklistReceived;
use App\Models\ServicelistReceived;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
		$event_code = $request->input('event_code', '');
		$customer_id = $request->input('customer_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$class1_id = $request->input('class1_id', '');
		$class2_id = $request->input('class2_id', '');
		$status = $request->input('status', '');
		$all = $request->input('all', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'event.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data =  Event::LeftJoin('customer as c', 'event.customer_id', 'c.customer_id')
			->LeftJoin('vessel as v', 'event.vessel_id', 'v.vessel_id')
			->LeftJoin('class as c1', 'c1.class_id', 'event.class1_id')
			->LeftJoin('class as c2', 'c2.class_id', 'event.class2_id');
		$data = $data->where('event.company_id', '=', $request->company_id);
		$data = $data->where('event.company_branch_id', '=', $request->company_branch_id);



		if ($all != 1) $data = $data->where('event.status', '=', 1);
		if (!empty($status) || $status == '0') $data = $data->where('event.status', '=', $status);
		if (!empty($event_code)) $data = $data->where('event_code', 'like', '%' . $event_code . '%');
		if (!empty($customer_id)) $data = $data->where('event.customer_id', '=', $customer_id);
		if (!empty($vessel_id)) $data = $data->where('event.vessel_id', '=', $vessel_id);
		if (!empty($class1_id)) $data = $data->where('c1.class_id', '=', $class1_id);
		if (!empty($class2_id)) $data = $data->where('c2.class_id', '=', $class2_id);


		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('v.name', 'like', '%' . $search . '%')
					->orWhere('c.name', 'like', '%' . $search . '%')
					->orWhere('c1.name', 'like', '%' . $search . '%')
					->orWhere('c2.name', 'like', '%' . $search . '%')
					->orWhere('event.status', '=', $search)
					->orWhere('event.event_code', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select(
			"event.*",
			DB::raw("CONCAT(event.event_code, ' (', v.name, ')') as event_name"),
			"c.name as customer_name",
			"v.name as vessel_name",
			"c1.name as class1_name",
			"c2.name as class2_name"
		);
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}



	public function getChargeOrders($id)
	{
		$chargeOrders = ChargeOrder::with([
			'event',
			'customer',
			'salesman',
			'agent',
			'vessel',
			'flag',
			'class1',
			'class2',
			'charge_order_detail',
			'charge_order_detail.product_type',
			'charge_order_detail.product',
			'charge_order_detail.unit',
			'charge_order_detail.supplier',
		])
			->where('event_id', $id)
			->orderBy('created_at', 'desc')
			->get();

		$event = Event::with([
			'customer',
			'customer.salesman',
			'vessel',
			'vessel.flag',
			'class1',
			'class2',
		])->find($id);

		if (!$event) {
			return $this->jsonResponse([], 404, "Event not found");
		}

		foreach ($chargeOrders as $chargeOrder) {
			$chargeOrder->charge_order_detail = $chargeOrder->charge_order_detail->filter(function ($detail) {
				return empty($detail->job_order_detail_id);
			});
		}

		return $this->jsonResponse([
			'charge_orders' => $chargeOrders,
			'event' => $event
		], 200, "Event Charge Orders Data");
	}
	public function EventJobOrders($id, Request $request)
	{

		$data = JobOrder::with(
			"job_order_detail",
			"job_order_detail.charge_order",
			"job_order_detail.product",
			"job_order_detail.product_type",
			"job_order_detail.unit",
			"job_order_detail.supplier",
			"event",
			"vessel",
			"customer",
			"flag",
			"class1",
			"class2",
			"salesman",
			"agent",
			"certificates",
		)->where('event_id', $id)->get();


		return $this->jsonResponse($data, 200, "Job Order Data");
	}

	public function EventChargeOrdersWithPicklists($id)
	{
		// Fetch picklists related to the event with all necessary relationships
		$picklists = Picklist::with([
			"charge_order",
			"charge_order.vessel",
			"charge_order.event",
			"picklist_detail",
			"picklist_detail.product"
		])->whereHas('charge_order', function ($query) use ($id) {
			$query->where('event_id', $id);
		})->get();

		if ($picklists->isEmpty()) {
			return $this->jsonResponse("Picklist not found", 404, "Picklist not found");
		}

		// Fetch received picklist history for all relevant picklists
		$receivedData = PicklistReceived::with([
			"picklist_received_detail",
			"picklist_received_detail.pulled_by",
			"picklist_received_detail.product",
			"picklist_received_detail.warehouse"
		])->whereIn('picklist_id', $picklists->pluck('picklist_id'))->get();

		// Prepare response data
		$response = [];

		foreach ($picklists as $picklist) {
			$picklistDetails = [];
			$items = [];

			foreach ($picklist->picklist_detail as $detail) {
				$picklistDetailId = $detail->picklist_detail_id;

				// Get received details for this specific picklist detail item
				$receivedDetails = $receivedData->flatMap(function ($received) {
					return $received->picklist_received_detail;
				})->where('picklist_detail_id', $picklistDetailId);

				// Sum received quantity
				$totalReceivedQty = $receivedDetails->sum('quantity');

				$warehouseNames = $receivedDetails->pluck('warehouse.name')->filter()->unique()->implode(', ');
				$remarks = $receivedDetails->pluck('remarks')->filter()->unique()->implode(', ');

				// Prepare picklist detail data
				$picklistDetails[] = [
					"picklist_detail_id" => $picklistDetailId,
					"picklist_id" => $picklist->picklist_id,
					"charge_order_detail_id" => $detail->charge_order_detail_id ?? null,
					"sort_order" => $detail->sort_order ?? 0,
					"product_id" => $detail->product_id ?? null,
					"product_description" => $detail->product->impa_code . " " . $detail->product->name ?? null,
					"quantity" => $detail->quantity,
					"created_by" => $detail->created_by ?? null,
					"updated_by" => $detail->updated_by ?? null,
					"created_at" => $detail->created_at,
					"updated_at" => $detail->updated_at,
					"product" => $detail->product
				];

				// Prepare items (received details)
				$items[] = [
					"picklist_detail_id" => $picklistDetailId,
					"product" => $detail->product,
					"original_quantity" => $detail->quantity,
					"total_received_quantity" => $totalReceivedQty,
					"remarks" => $remarks ?: null,
					"warehouse" => ["name" => $warehouseNames ?: null],
				];
			}

			// Construct full picklist response object
			$response[] = [
				"picklist_id" => $picklist->picklist_id,
				"company_id" => $picklist->company_id,
				"company_branch_id" => $picklist->company_branch_id,
				"document_type_id" => $picklist->document_type_id,
				"document_no" => $picklist->document_no,
				"document_prefix" => $picklist->document_prefix,
				"document_identity" => $picklist->document_identity,
				"document_date" => $picklist->document_date,
				"charge_order_id" => $picklist->charge_order_id,
				"total_quantity" => $picklist->total_quantity,
				"created_by" => $picklist->created_by,
				"updated_by" => $picklist->updated_by,
				"created_at" => $picklist->created_at,
				"updated_at" => $picklist->updated_at,
				"charge_order" => $picklist->charge_order,
				"picklist_detail" => $picklistDetails,
				"items" => $items
			];
		}

		return $this->jsonResponse($response, 200, "Picklist Details");
	}


	public function show($id, Request $request)
	{
		$data =  Event::LeftJoin('customer as c', 'event.customer_id', 'c.customer_id')
			->LeftJoin('vessel as v', 'event.vessel_id', 'v.vessel_id')
			->LeftJoin('flag as f', 'f.flag_id', 'v.flag_id')
			->LeftJoin('class as c1', 'c1.class_id', 'event.class1_id')
			->LeftJoin('class as c2', 'c2.class_id', 'event.class2_id')
			->LeftJoin('payment as p', 'p.payment_id', 'c.payment_id')
			->LeftJoin('salesman as s', 's.salesman_id', 'c.salesman_id')
			->select(
				"event.*",
				DB::raw("CONCAT(event.event_code, ' (', v.name, ')') as event_name"),
				"c.name as customer_name",
				"c.rebate_percent",
				"p.payment_id",
				"p.name as payment_name",
				"v.name as vessel_name",
				"v.imo",
				"c1.name as class1_name",
				"c2.name as class2_name",
				"f.name as flag_name",
				"f.flag_id",
				"s.salesman_id as salesman_id",
				"s.name as salesman_name"
			)
			->where('event_id', $id)->first();
		return $this->jsonResponse($data, 200, "Event Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'customer_id' => 'required',
			'vessel_id' => 'required',
		];


		$validator = Validator::make($request, $rules);
		$response = [];
		if ($validator->fails()) {
			$response =  $errors = $validator->errors()->all();
			$firstError = $validator->errors()->first();
			return  $firstError;
		}
		return [];
	}



	public function store(Request $request)
	{

		if (!isPermission('add', 'event', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$maxCode = Event::where('company_id', $request->company_id)
			->where('company_branch_id', $request->company_branch_id)
			->max('event_no');

		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'event_id' => $uuid,
			'event_code' => str_pad($maxCode + 1, 4, '0', STR_PAD_LEFT),
			'event_no' => $maxCode + 1,
			'customer_id' => $request->customer_id ?? "",
			'vessel_id' => $request->vessel_id ?? "",
			'class1_id' => $request->class1_id ?? "",
			'class2_id' => $request->class2_id ?? "",
			'status' => $request->status ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$user = Event::InsertGetId($insertArr);
		EventDispatch::create([
			'event_dispatch_id' => $this->get_uuid(),
			'company_id' => $request->company_id,
			'company_branch_id' => $request->company_branch_id,
			'event_id' => $uuid,
		]);

		return $this->jsonResponse(['event_id' => $uuid], 200, "Add Event Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'event', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data  = Event::where('event_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->event_code  = $request->event_code ?? "";
		$data->event_no  = $request->event_no ?? "";
		$data->customer_id  = $request->customer_id ?? "";
		$data->vessel_id  = $request->vessel_id ?? "";
		$data->class1_id  = $request->class1_id ?? "";
		$data->class2_id  = $request->class2_id ?? "";
		$data->status  = $request->status ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;
		$data->update();

		return $this->jsonResponse(['event_id' => $id], 200, "Update Event Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'event', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Event::where('event_id', $id)->first();

		if (!$data) return $this->jsonResponse(['event_id' => $id], 404, "Event Not Found!");

		$data->delete();
		EventDispatch::where(['event_id' => $id])->delete();
		return $this->jsonResponse(['event_id' => $id], 200, "Delete Event Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'event', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->event_ids) && !empty($request->event_ids) && is_array($request->event_ids)) {
				foreach ($request->event_ids as $event_id) {
					$user = Event::where(['event_id' => $event_id])->first();
					$user->delete();
					EventDispatch::where(['event_id' => $event_id])->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Event successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
