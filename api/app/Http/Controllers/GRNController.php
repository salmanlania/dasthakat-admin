<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use App\Models\GRN;
use App\Models\GRNDetail;
use App\Models\StockLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GRNController extends Controller
{
	protected $document_type_id = 41;
	protected $db;

	public function index(Request $request)
	{
		$supplier_id = $request->input('supplier_id', '');
		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$purchase_order_id = $request->input('purchase_order_id', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'good_received_note.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = GRN::LeftJoin('supplier as s', 's.supplier_id', '=', 'good_received_note.supplier_id')
			->LeftJoin('purchase_order as p', 'p.purchase_order_id', '=', 'good_received_note.purchase_order_id');

		if (!empty($supplier_id)) $data = $data->where('good_received_note.supplier_id', '=',  $supplier_id);
		if (!empty($purchase_order_id)) $data = $data->where('good_received_note.purchase_order_id', '=',  $purchase_order_id);
		if (!empty($document_identity)) $data = $data->where('good_received_note.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('good_received_note.document_date', '=',  $document_date);
		$data = $data->where('good_received_note.company_id', '=', $request->company_id);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('s.name', 'like', '%' . $search . '%')
					->OrWhere('p.document_identity', 'like', '%' . $search . '%')
					->OrWhere('good_received_note.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("good_received_note.*", "s.name as supplier_name", "p.document_identity as purchase_order_no");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = GRN::with(
			"grn_detail",
			"grn_detail.product",
			"grn_detail.warehouse",
			"grn_detail.unit",
			"payment",
			"supplier",
			"purchase_order",
		)
			->where('good_received_note_id', $id)->first();

		return $this->jsonResponse($data, 200, "Good Received Note Data");
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

		if (!isPermission('add', 'good_received_note', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'good_received_note_id' => $uuid,
			'document_type_id' => $document['document_type_id'] ?? "",
			'document_no' => $document['document_no'] ?? "",
			'document_prefix' => $document['document_prefix'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_date' => $request->document_date ?? "",
			'supplier_id' => $request->supplier_id ?? "",
			'purchase_order_id' => $request->purchase_order_id ?? "",
			'payment_id' => $request->payment_id ?? "",
			'remarks' => $request->remarks ?? "",
			'total_quantity' => $request->total_quantity ?? "",
			'total_amount' => $request->total_amount ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		GRN::create($insertArr);

		if ($request->good_received_note_detail) {
			foreach ($request->good_received_note_detail as $value) {
				$detail_uuid = $this->get_uuid();
				$insert = [
					'good_received_note_id' => $insertArr['good_received_note_id'],
					'good_received_note_detail_id' => $detail_uuid,
					'sort_order' => $value['sort_order'] ?? "",
					'product_id' => $value['product_id'] ?? "",
					'description' => $value['description'] ?? "",
					'warehouse_id' => $value['warehouse_id'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					'supplier_id' => $value['supplier_id'] ?? "",
					'quantity' => $value['quantity'] ?? "",
					'rate' => $value['rate'] ?? "",
					'amount' => $value['amount'] ?? "",
					'vendor_notes' => $value['vendor_notes'] ?? "",
					'created_at' => date('Y-m-d H:i:s'),
					'created_by' => $request->login_user_id,
				];
				StockLedger::handleStockMovement([
					'master_model' => new GRN,
					'document_id' => $uuid,
					'document_detail_id' => $detail_uuid,
					'row' => $value,
				],'I');

				GRNDetail::create($insert);
			}
		}


		return $this->jsonResponse(['good_received_note_id' => $uuid], 200, "Add Good Received Note Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'good_received_note', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = GRN::where('good_received_note_id', $id)->first();
		$data->company_id = $request->company_id;
		$data->company_branch_id = $request->company_branch_id;
		$data->document_date = $request->document_date;
		$data->supplier_id = $request->supplier_id;
		$data->purchase_order_id = $request->purchase_order_id;
		$data->payment_id = $request->payment_id;
		$data->remarks = $request->remarks;
		$data->total_quantity = $request->total_quantity;
		$data->total_amount = $request->total_amount;
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;
		$data->update();
		GRNDetail::where('good_received_note_id', $id)->delete();
		StockLedger::where('document_id', $id)->delete();
		if ($request->purchase_order_detail) {

			foreach ($request->purchase_order_detail as $key => $value) {
				$detail_uuid = $this->get_uuid();

				$insertArr = [
					'good_received_note_id' => $id,
					'good_received_note_detail_id' => $detail_uuid,
					'sort_order' => $value['sort_order'] ?? "",
					'product_id' => $value['product_id'] ?? "",
					'description' => $value['description'] ?? "",
					'warehouse_id' => $value['warehouse_id'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					'quantity' => $value['quantity'] ?? "",
					'rate' => $value['rate'] ?? "",
					'amount' => $value['amount'] ?? "",
					'vendor_notes' => $value['vendor_notes'] ?? "",
					'created_at' => date('Y-m-d H:i:s'),
					'created_by' => $request->login_user_id,
				];

				StockLedger::handleStockMovement([
					'master_model' => new GRN,
					'document_id' => $id,
					'document_detail_id' => $detail_uuid,
					'row' => $value,
				],'I');
				GRNDetail::create($insertArr);
			}
		}


		return $this->jsonResponse(['good_received_note_id' => $id], 200, "Update Good Received Note Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'good_received_note', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = GRN::where('good_received_note_id', $id)->first();
		if (!$data) return $this->jsonResponse(['good_received_note_id' => $id], 404, "Good Received Note Not Found!");
		$data->delete();
		GRNDetail::where('good_received_note_id', $id)->delete();
		StockLedger::where('document_id', $id)->delete();
		return $this->jsonResponse(['good_received_note_id' => $id], 200, "Delete Good Received Note Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'good_received_note', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->good_received_note_ids) && !empty($request->good_received_note_ids) && is_array($request->good_received_note_ids)) {
				foreach ($request->good_received_note_ids as $good_received_note_id) {
					$data = GRN::where(['good_received_note_id' => $good_received_note_id])->first();
					$data->delete();
					GRNDetail::where('good_received_note_id', $good_received_note_id)->delete();
					StockLedger::where('document_id', $good_received_note_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Good Received Note successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
