<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use App\Models\GRN;
use App\Models\GRNDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
	protected $document_type_id = 40;
	protected $db;

	public function index(Request $request)
	{
		$supplier_id = $request->input('supplier_id', '');
		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$required_date = $request->input('required_date', '');
		$quotation_id = $request->input('quotation_id', '');
		$charge_order_id = $request->input('charge_order_id', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'purchase_order.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = PurchaseOrder::LeftJoin('supplier as s', 's.supplier_id', '=', 'purchase_order.supplier_id')
			->LeftJoin('quotation as q', 'q.quotation_id', '=', 'purchase_order.quotation_id')
			->LeftJoin('charge_order as co', 'co.charge_order_id', '=', 'purchase_order.charge_order_id');
			$data = $data->where('purchase_order.company_id', '=', $request->company_id);
			$data = $data->where('purchase_order.company_branch_id', '=', $request->company_branch_id);

		if (!empty($supplier_id)) $data = $data->where('purchase_order.supplier_id', '=',  $supplier_id);
		if (!empty($quotation_id)) $data = $data->where('purchase_order.quotation_id', '=',  $quotation_id);
		if (!empty($charge_order_id)) $data = $data->where('purchase_order.charge_order_id', '=',  $charge_order_id);
		if (!empty($document_identity)) $data = $data->where('purchase_order.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('purchase_order.document_date', '=',  $document_date);
		if (!empty($required_date)) $data = $data->where('purchase_order.required_date', '=',  $required_date);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('s.name', 'like', '%' . $search . '%')
					->OrWhere('q.document_identity', 'like', '%' . $search . '%')
					->OrWhere('co.document_identity', 'like', '%' . $search . '%')
					->OrWhere('purchase_order.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("purchase_order.*", "s.name as supplier_name", "q.document_identity as quotation_no", "co.document_identity as charge_no");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = PurchaseOrder::with(
			"purchase_order_detail",
			"purchase_order_detail.product",
			"purchase_order_detail.product_type",
			"purchase_order_detail.unit",
			"user",
			"payment",
			"supplier",
			"quotation",
			"charge_order",
			"charge_order.event",
			"charge_order.vessel",
			"charge_order.customer",
		)
			->where('purchase_order_id', $id)->first();

		foreach ($data->purchase_order_detail as $key => &$value) {
			$grn = GRN::with("grn_detail")->where('purchase_order_id', $id)->get();
			$receivedQty = 0;
			foreach ($grn as $grnData) {
				foreach ($grnData->grn_detail as $grnDetail) {
					if ($value->product_id == $grnDetail->product_id) {
						$receivedQty += $grnDetail->quantity;
					}
				}
			}
			if ($receivedQty > 0) {
				$value->editable = false;
			}
		}


		return $this->jsonResponse($data, 200, "Purchase Order Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'document_date' => ['required'],
			'required_date' => ['required'],
			'type' => ['required'],
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

		if (!isPermission('add', 'purchase_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'purchase_order_id' => $uuid,
			'document_type_id' => $document['document_type_id'] ?? "",
			'document_no' => $document['document_no'] ?? "",
			'document_prefix' => $document['document_prefix'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_date' => $request->document_date ?? "",
			'required_date' => $request->required_date ?? "",
			'supplier_id' => $request->supplier_id ?? "",
			'buyer_id' => $request->buyer_id ?? "",
			'ship_via' => $request->ship_via ?? "",
			'ship_to' => $request->ship_to ?? "",
			'department' => $request->department ?? "",
			'type' => $request->type ?? "",
			'quotation_id' => $request->quotation_id ?? "",
			'charge_order_id' => $request->charge_order_id ?? "",
			'payment_id' => $request->payment_id ?? "",
			'remarks' => $request->remarks ?? "",
			'total_quantity' => $request->total_quantity ?? "",
			'total_amount' => $request->total_amount ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		PurchaseOrder::create($insertArr);

		if ($request->purchase_order_detail) {
			foreach ($request->purchase_order_detail as $key => $value) {
				$detail_uuid = $this->get_uuid();
				$insert = [
					'purchase_order_id' => $insertArr['purchase_order_id'],
					'purchase_order_detail_id' => $detail_uuid,
					'sort_order' => $value['sort_order'] ?? "",
					'product_id' => $value['product_id'] ?? "",
					'product_type_id' => $value['product_type_id'] ?? "",
					'product_name' => $value['product_name'] ?? "",
					'description' => $value['description'] ?? "",
					'vpart' => $value['vpart'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					'supplier_id' => $value['supplier_id'] ?? "",
					'quantity' => $value['quantity'] ?? "",
					'rate' => $value['rate'] ?? "",
					'amount' => $value['amount'] ?? "",
					'vendor_notes' => $value['vendor_notes'] ?? "",
					'created_at' => date('Y-m-d H:i:s'),
					'created_by' => $request->login_user_id,
				];

				PurchaseOrderDetail::create($insert);
			}
		}


		return $this->jsonResponse(['purchase_order_id' => $uuid], 200, "Add Purchase Order Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'purchase_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = PurchaseOrder::where('purchase_order_id', $id)->first();
		$data->company_id = $request->company_id;
		$data->company_branch_id = $request->company_branch_id;
		$data->document_date = $request->document_date;
		$data->required_date = $request->required_date;
		$data->supplier_id = $request->supplier_id;
		$data->buyer_id = $request->buyer_id;
		$data->ship_via = $request->ship_via;
		$data->ship_to = $request->ship_to;
		$data->department = $request->department;
		$data->type = $request->type;
		$data->quotation_id = $request->quotation_id;
		$data->charge_order_id = $request->charge_order_id;
		$data->payment_id = $request->payment_id;
		$data->remarks = $request->remarks;
		$data->total_quantity = $request->total_quantity;
		$data->total_amount = $request->total_amount;
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;
		$data->update();
		PurchaseOrderDetail::where('purchase_order_id', $id)->delete();
		if ($request->purchase_order_detail) {

			foreach ($request->purchase_order_detail as $key => $value) {
				$detail_uuid = $this->get_uuid();

				$insertArr = [
					'purchase_order_id' => $id,
					'purchase_order_detail_id' => $detail_uuid,
					'sort_order' => $value['sort_order'] ?? "",
					'product_id' => $value['product_id'] ?? "",
					'product_type_id' => $value['product_type_id'] ?? "",
					'product_name' => $value['product_name'] ?? "",
					'description' => $value['description'] ?? "",
					'vpart' => $value['vpart'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					'quantity' => $value['quantity'] ?? "",
					'rate' => $value['rate'] ?? "",
					'amount' => $value['amount'] ?? "",
					'vendor_notes' => $value['vendor_notes'] ?? "",
					'created_at' => date('Y-m-d H:i:s'),
					'created_by' => $request->login_user_id,
				];
				PurchaseOrderDetail::create($insertArr);
			}
		}


		return $this->jsonResponse(['purchase_order_id' => $id], 200, "Update Purchase Order Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'purchase_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = PurchaseOrder::where('purchase_order_id', $id)->first();
		if (!$data) return $this->jsonResponse(['purchase_order_id' => $id], 404, "Purchase Order Not Found!");
		$data->delete();
		PurchaseOrderDetail::where('purchase_order_id', $id)->delete();
		return $this->jsonResponse(['purchase_order_id' => $id], 200, "Delete Purchase Order Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'purchase_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->purchase_order_ids) && !empty($request->purchase_order_ids) && is_array($request->purchase_order_ids)) {
				foreach ($request->purchase_order_ids as $purchase_order_id) {
					$user = PurchaseOrder::where(['purchase_order_id' => $purchase_order_id])->first();
					$user->delete();
					PurchaseOrderDetail::where('purchase_order_id', $purchase_order_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Purchase Order successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
