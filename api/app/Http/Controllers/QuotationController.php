<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Quotation;
use App\Models\QuotationDetail;
use App\Models\QuotationStatus;
use App\Models\StockLedger;
use App\Models\Terms;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class QuotationController extends Controller
{
	protected $document_type_id = 38;
	protected $db;

	public function index(Request $request)
	{
		$port_id = $request->input('port_id', '');
		$customer_ref = $request->input('customer_ref', '');
		$customer_id = $request->input('customer_id', '');
		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$vessel_id = $request->input('vessel_id', '');
		$event_id = $request->input('event_id', '');
		$search = $request->input('search', '');
		$status = $request->input('status', '');
		$status_updated_by = $request->input('status_updated_by', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'quotation.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$latestStatusSubquery = DB::table('quotation_status as qs1')
			->select('qs1.quotation_id', 'qs1.status', 'qs1.created_by')
			->whereRaw('qs1.id = (
        SELECT qs2.id
        FROM quotation_status as qs2
        WHERE qs2.quotation_id = qs1.quotation_id order by qs2.created_at desc  limit 1
    )');


		$data = Quotation::LeftJoin('customer as c', 'c.customer_id', '=', 'quotation.customer_id')
			->LeftJoin('port as p', 'p.port_id', '=', 'quotation.port_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'quotation.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'quotation.vessel_id')
			->leftJoinSub($latestStatusSubquery, 'qs', 'qs.quotation_id', '=', 'quotation.quotation_id')
			->leftJoin('user as u', 'u.user_id', '=', 'qs.created_by');
		$data = $data->where('quotation.company_id', '=', $request->company_id);
		$data = $data->where('quotation.company_branch_id', '=', $request->company_branch_id);

		if (!empty($status_updated_by)) $data = $data->where('qs.created_by', '=',  $status_updated_by);
		if (!empty($status)) $data = $data->where('quotation.status', '=',  $status);
		if (!empty($port_id)) $data = $data->where('quotation.port_id', '=',  $port_id);
		if (!empty($customer_id)) $data = $data->where('quotation.customer_id', '=',  $customer_id);
		if (!empty($vessel_id)) $data = $data->where('quotation.vessel_id', '=',  $vessel_id);
		if (!empty($event_id)) $data = $data->where('quotation.event_id', '=',  $event_id);
		if (!empty($customer_ref)) $data = $data->where('quotation.customer_ref', 'like', '%' . $customer_ref . '%');
		if (!empty($document_identity)) $data = $data->where('quotation.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('quotation.document_date', '=',  $document_date);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('c.name', 'like', '%' . $search . '%')
					->OrWhere('quotation.customer_ref', 'like', '%' . $search . '%')
					->OrWhere('p.name', 'like', '%' . $search . '%')
					->OrWhere('u.user_name', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('quotation.status', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('quotation.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("quotation.*", DB::raw("CONCAT(e.event_code, ' (', CASE 
		WHEN e.status = 1 THEN 'Active' 
		ELSE 'Inactive' 
	END, ')') AS event_code"), 'u.user_name as status_updated_by', "c.name as customer_name", "v.name as vessel_name", "p.name as port_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = Quotation::with(
			"quotation_detail",
			"quotation_detail.product",
			"quotation_detail.product_type",
			"quotation_detail.unit",
			"quotation_detail.supplier",
			"salesman",
			"event",
			"vessel",
			"customer",
			"flag",
			"class1",
			"class2",
			"validity",
			"payment",
			"port",
			"person_incharge"
		)
			->where('quotation_id', $id)->first();

		if ($data) {
			foreach ($data->quotation_detail as $detail) {
				if ($detail->product) {
					$detail->product->stock = StockLedger::Check($detail->product, $request->all());
				}
				$chargeOrderQty = ChargeOrderDetail::where('quotation_detail_id', $detail->quotation_detail_id)->sum('quantity') ?? 0;
				$detail->available_quantity = ($detail->quantity ?? 0) - $chargeOrderQty;
			}
		}

		$terms = [];
		if ($data && !empty($data->term_id)) {
			$term_id = json_decode($data->term_id, true) ?? [];
			foreach ($term_id as $key => $value) {
				$term = Terms::where('term_id', $value)->select('term_id as value', 'name as label')->first();
				if ($term) {
					$terms[$key] = $term;
				}
			}
		}
		$data['term_id'] = $terms;

		// if (isset($request->hasAvailableQty) && $request->hasAvailableQty == true) {
		// 	$quotationDetails = $data->quotation_detail->toArray();
		// 	$filteredDetails = array_filter($quotationDetails, function ($detail) {
		// 		return ($detail['available_quantity'] ?? 0) > 0;
		// 	});
		// 	unset(	$data->quotation_detail);
		// 	$data->quotation_detail = array_values($filteredDetails);
		// }

		return $this->jsonResponse($data, 200, "Quotation Data");
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

		if (!isPermission('add', 'quotation', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'quotation_id' => $uuid,
			'document_type_id' => $document['document_type_id'] ?? "",
			'document_no' => $document['document_no'] ?? "",
			'document_prefix' => $document['document_prefix'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_date' => $request->document_date ?? "",
			'service_date' => $request->service_date ?? "",
			'salesman_id' => $request->salesman_id ?? "",
			'customer_id' => $request->customer_id ?? "",
			'person_incharge_id' => $request->person_incharge_id ?? "",
			'event_id' => $request->event_id ?? "",
			'vessel_id' => $request->vessel_id ?? "",
			'flag_id' => $request->flag_id ?? "",
			'class1_id' => $request->class1_id ?? "",
			'class2_id' => $request->class2_id ?? "",
			'customer_ref' => $request->customer_ref ?? "",
			'due_date' => ($request->due_date) ?? "",
			'attn' => $request->attn ?? "",
			'delivery' => $request->delivery ?? "",
			'validity_id' => $request->validity_id ?? "",
			'payment_id' => $request->payment_id ?? "",
			'internal_notes' => $request->internal_notes ?? "",
			'port_id' => $request->port_id ?? "",
			'term_id' => json_encode($request->term_id) ?? "",
			'term_desc' => $request->term_desc ?? "",
			'total_cost' => $request->total_cost ?? "",
			'total_quantity' => $request->total_quantity ?? "",
			'total_amount' => $request->total_amount ?? "",
			'total_discount' => $request->total_discount ?? "",
			'net_amount' => $request->net_amount ?? "",
			'rebate_percent' => $request->rebate_percent ?? "",
			'rebate_amount' => $request->rebate_amount ?? "",
			'salesman_percent' => $request->salesman_percent ?? "",
			'salesman_amount' => $request->salesman_amount ?? "",
			'final_amount' => $request->final_amount ?? "",
			'remarks' => $request->remarks ?? "",
			'status' => $request->status ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		Quotation::create($insertArr);

		QuotationStatus::create([
			'id' => $this->get_uuid(),
			'quotation_id' => $uuid,
			'status' => $request->status,
			'created_by' => $request->login_user_id,
			'created_at' => Carbon::now(),
		]);

		if ($request->quotation_detail) {
			foreach ($request->quotation_detail as $key => $value) {
				$detail_uuid = $this->get_uuid();
				$insert = [
					'quotation_id' => $insertArr['quotation_id'],
					'quotation_detail_id' => $detail_uuid,
					'sort_order' => $value['sort_order'] ?? "",
					'product_id' => $value['product_id'] ?? "",
					'product_type_id' => $value['product_type_id'] ?? "",
					'product_name' => $value['product_name'] ?? "",
					'product_description' => $value['product_description'] ?? "",
					'description' => $value['description'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					'supplier_id' => $value['supplier_id'] ?? "",
					'vendor_part_no' => $value['vendor_part_no'] ?? "",
					'quantity' => $value['quantity'] ?? "",
					'cost_price' => $value['cost_price'] ?? "",
					'markup' => $value['markup'] ?? "",
					'rate' => $value['rate'] ?? "",
					'amount' => $value['amount'] ?? "",
					'internal_notes' => $value['internal_notes'] ?? "",
					'discount_amount' => $value['discount_amount'] ?? "",
					'discount_percent' => $value['discount_percent'] ?? "",
					'gross_amount' => $value['gross_amount'] ?? "",
					'created_at' => date('Y-m-d H:i:s'),
					'created_by' => $request->login_user_id,
				];

				QuotationDetail::create($insert);
			}
		}


		return $this->jsonResponse(['quotation_id' => $uuid], 200, "Add Quotation Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'quotation', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = Quotation::where('quotation_id', $id)->first();
		$data->company_id = $request->company_id;
		$data->company_branch_id = $request->company_branch_id;
		$data->document_date = $request->document_date;
		$data->service_date = $request->service_date;
		$data->salesman_id = $request->salesman_id;
		$data->customer_id = $request->customer_id;
		$data->person_incharge_id = $request->person_incharge_id;
		$data->event_id = $request->event_id;
		$data->vessel_id = $request->vessel_id;
		$data->flag_id = $request->flag_id;
		$data->class1_id = $request->class1_id;
		$data->class2_id = $request->class2_id;
		$data->customer_ref = $request->customer_ref;
		$data->due_date = $request->due_date;
		$data->attn = $request->attn;
		$data->delivery = $request->delivery;
		$data->validity_id = $request->validity_id;
		$data->payment_id = $request->payment_id;
		$data->internal_notes = $request->internal_notes;
		$data->port_id = $request->port_id;
		$data->term_id = json_encode($request->term_id);
		$data->term_desc = $request->term_desc;
		$data->total_cost = $request->total_cost;
		$data->total_quantity = $request->total_quantity;
		$data->total_amount = $request->total_amount;
		$data->total_discount = $request->total_discount;
		$data->net_amount = $request->net_amount;
		$data->rebate_percent = $request->rebate_percent;
		$data->rebate_amount = $request->rebate_amount;
		$data->salesman_percent = $request->salesman_percent;
		$data->salesman_amount = $request->salesman_amount;
		$data->final_amount = $request->final_amount;
		$data->remarks = $request->remarks;
		$data->status = $request->status;
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;
		$data->update();

		$latest_status = QuotationStatus::where('quotation_id', $id)->latest()->first();
		if (isset($latest_status)) {
			if ($latest_status->status != $request->status) {
				QuotationStatus::create([
					'id' => $this->get_uuid(),
					'quotation_id' => $id,
					'status' => $request->status,
					'created_by' => $request->login_user_id,
					'created_at' => Carbon::now(),
				]);
			}
		} else {
			if ($request->status) {
				QuotationStatus::create([
					'id' => $this->get_uuid(),
					'quotation_id' => $id,
					'status' => $request->status,
					'created_by' => $request->login_user_id,
					'created_at' => Carbon::now(),
				]);
			}
		}

		if ($request->quotation_detail) {
			foreach ($request->quotation_detail as $value) {
				try {
					if ($value['row_status'] == 'I') {
						$detail_uuid = $this->get_uuid();
						$insertArr = [
							'quotation_id' => $id,
							'quotation_detail_id' => $detail_uuid,
							'sort_order' => $value['sort_order'] ?? "",
							'product_id' => $value['product_id'] ?? "",
							'product_type_id' => $value['product_type_id'] ?? "",
							'product_name' => $value['product_name'] ?? "",
							'product_description' => $value['product_description'] ?? "",
							'description' => $value['description'] ?? "",
							'unit_id' => $value['unit_id'] ?? "",
							'supplier_id' => $value['supplier_id'] ?? "",
							'vendor_part_no' => $value['vendor_part_no'] ?? "",
							'internal_notes' => $value['internal_notes'] ?? "",
							'quantity' => $value['quantity'] ?? "",
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
						QuotationDetail::create($insertArr);
					}
					if ($value['row_status'] == 'U') {
						$update = [
							'sort_order' => $value['sort_order'] ?? "",
							'product_id' => $value['product_id'] ?? "",
							'product_type_id' => $value['product_type_id'] ?? "",
							'product_name' => $value['product_name'] ?? "",
							'product_description' => $value['product_description'] ?? "",
							'description' => $value['description'] ?? "",
							'unit_id' => $value['unit_id'] ?? "",
							'supplier_id' => $value['supplier_id'] ?? "",
							'vendor_part_no' => $value['vendor_part_no'] ?? "",
							'internal_notes' => $value['internal_notes'] ?? "",
							'quantity' => $value['quantity'] ?? "",
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
						QuotationDetail::where('quotation_detail_id', $value['quotation_detail_id'])->update($update);
					}
					if ($value['row_status'] == 'D') {
						QuotationDetail::where('quotation_detail_id', $value['quotation_detail_id'])->delete();
					}
				} catch (\Exception $e) {
					return $this->jsonResponse($e->getMessage(), 500, 'Error');
				}
			}
		}


		return $this->jsonResponse(['quotation_id' => $id], 200, "Update Quotation Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'quotation', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = Quotation::where('quotation_id', $id)->first();
		if (!$data) return $this->jsonResponse(['quotation_id' => $id], 404, "Quotation Not Found!");


		$validate = [
			'main' => [
				'check' => new Quotation,
				'id' => $id,
				'key' => 'document_identity',
			],
			'with' => [
				['model' => new ChargeOrder, 'key' => 'ref_document_identity'],
			]
		];

		$response = $this->checkAndDelete($validate);
		if ($response['error']) {
			return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
		}


		$data->delete();
		QuotationDetail::where('quotation_id', $id)->delete();
		QuotationStatus::where('quotation_id', $id)->delete();
		return $this->jsonResponse(['quotation_id' => $id], 200, "Delete Quotation Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'quotation', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->quotation_ids) && !empty($request->quotation_ids) && is_array($request->quotation_ids)) {
				foreach ($request->quotation_ids as $id) {
					$data = Quotation::where(['quotation_id' => $id])->first();


					$validate = [
						'main' => [
							'check' => new Quotation,
							'id' => $id,
							'key' => 'document_identity',
						],
						'with' => [
							['model' => new ChargeOrder, 'key' => 'ref_document_identity'],
						]
					];

					$response = $this->checkAndDelete($validate);
					if ($response['error']) {
						return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
					}

					$data->delete();
					QuotationDetail::where('quotation_id', $id)->delete();
					QuotationStatus::where('quotation_id', $id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Quotation successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
