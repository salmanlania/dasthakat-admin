<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\Terms;
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

		if (!empty($customer_id)) $data = $data->where('charge_order.customer_id', '=',  $customer_id);
		if (!empty($vessel_id)) $data = $data->where('charge_order.vessel_id', '=',  $vessel_id);
		if (!empty($event_id)) $data = $data->where('charge_order.event_id', '=',  $event_id);
		if (!empty($document_identity)) $data = $data->where('charge_order.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('charge_order.document_date', '=',  $document_date);
		$data = $data->where('charge_order.company_id', '=', $request->company_id);

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

		return $this->jsonResponse($data, 200, "Charge Order Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'document_date' => ['required'],
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

		if (!isPermission('add', 'charge_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'charge_order_id' => $uuid,
			'document_type_id' => $document['document_type_id'] ?? "",
			'document_no' => $document['document_no'] ?? "",
			'document_prefix' => $document['document_prefix'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'ref_document_type_id' => $request->ref_document_type_id ?? "",
			'ref_document_identity' => $request->ref_document_identity ?? "",
			'document_date' => ($request->document_date) ?? "",
			'salesman_id' => $request->salesman_id ?? "",
			'customer_id' => $request->customer_id ?? "",
			'event_id' => $request->event_id ?? "",
			'vessel_id' => $request->vessel_id ?? "",
			'flag_id' => $request->flag_id ?? "",
			'class1_id' => $request->class1_id ?? "",
			'class2_id' => $request->class2_id ?? "",
			'agent_id' => $request->agent_id ?? "",
			'remarks' => $request->remarks ?? "",
			'total_quantity' => $request->total_quantity ?? "",
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
					'product_type' => $value['product_type'] ?? "",
					'description' => $value['description'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					'supplier_id' => $value['supplier_id'] ?? "",
					'quantity' => $value['quantity'] ?? "",
					'created_at' => date('Y-m-d H:i:s'),
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
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = ChargeOrder::where('charge_order_id', $id)->first();
		$data->company_id = $request->company_id;
		$data->company_branch_id = $request->company_branch_id;
		$data->ref_document_type_id = $request->ref_document_type_id;
		$data->ref_document_identity = $request->ref_document_identity;
		$data->document_date = $request->document_date;
		$data->salesman_id = $request->salesman_id;
		$data->customer_id = $request->customer_id;
		$data->event_id = $request->event_id;
		$data->vessel_id = $request->vessel_id;
		$data->flag_id = $request->flag_id;
		$data->class1_id = $request->class1_id;
		$data->class2_id = $request->class2_id;
		$data->agent_id = $request->agent_id;
		$data->remarks = $request->remarks;
		$data->total_quantity = $request->total_quantity;
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
					'product_id' => $value['product_id'] ?? "",
					'product_name' => $value['product_name'] ?? "",
					'product_type' => $value['product_type'] ?? "",
					'description' => $value['description'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					'supplier_id' => $value['supplier_id'] ?? "",
					'quantity' => $value['quantity'] ?? "",
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
