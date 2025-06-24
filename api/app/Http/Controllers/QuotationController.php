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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QuotationController extends Controller
{
	protected $document_type_id = 38;
	protected $db;

	public function index(Request $request)
	{
		// Extract all input parameters at once
		$params = $request->only([
			'total_amount','port_id', 'customer_ref', 'customer_id', 'document_identity', 
			'document_date', 'vessel_id', 'event_id', 'search', 'status',
			'status_updated_by', 'page', 'limit', 'sort_column', 'sort_direction',
			'start_date', 'end_date'
		]);
		
		// Set defaults
		$params['page'] = $params['page'] ?? 1;
		$params['limit'] = $params['limit'] ?? 10;
		$params['sort_column'] = $params['sort_column'] ?? 'quotation.created_at';
		$params['sort_direction'] = ($params['sort_direction'] ?? 'descend') == 'ascend' ? 'asc' : 'desc';
	
		// Generate cache key based on all parameters and user context
		$cacheKey = sprintf('quotations:%s:%s:%s', 
			$request->company_id, 
			$request->company_branch_id,
			md5(json_encode($params))
		);
	
		// Return cached response if available
		if (Cache::has($cacheKey)) {
			return response()->json(Cache::get($cacheKey));
		}
	
		// Start building the query with only essential joins
		$query = Quotation::query()
			->select([
				'quotation.total_amount',
				'quotation.document_date',
				'quotation.quotation_id',
				'quotation.document_identity',
				'quotation.vessel_id',
				'quotation.event_id',
				'quotation.customer_id',
				'quotation.port_id',
				'quotation.customer_ref',
				'quotation.status',
				DB::raw("(SELECT created_at FROM quotation_status WHERE quotation_id = quotation.quotation_id AND status = 'Sent to customer' ORDER BY created_at DESC LIMIT 1) as qs_date"),
				DB::raw("(SELECT u.user_name FROM quotation_status qs LEFT JOIN `user` u ON qs.created_by = u.user_id WHERE qs.quotation_id = quotation.quotation_id ORDER BY qs.created_at DESC LIMIT 1) as status_updated_by"),
				DB::raw("(SELECT CONCAT(event_code, ' (', IF(status = 1, 'Active', 'Inactive'), ')') FROM event WHERE event_id = quotation.event_id) as event_code"),
				DB::raw("(SELECT name FROM customer WHERE customer_id = quotation.customer_id) as customer_name"),
				DB::raw("(SELECT name FROM vessel WHERE vessel_id = quotation.vessel_id) as vessel_name"),
				DB::raw("(SELECT name FROM port WHERE port_id = quotation.port_id) as port_name")
			])
			->where('quotation.company_id', $request->company_id)
			->where('quotation.company_branch_id', $request->company_branch_id);
	
		// Apply filters using optimized conditions
		$this->applyFilters($query, $params);
	
		// Execute the query with optimized pagination
		$result = $query->orderBy($params['sort_column'], $params['sort_direction'])
					   ->paginate($params['limit'], ['quotation.quotation_id'], 'page', $params['page']);
	
		// Cache the result for 2 minutes (adjust based on your needs)
		Cache::put($cacheKey, $result, Carbon::now()->addSeconds(1));
	
		return response()->json($result);
	}
	
	protected function applyFilters($query, $params)
	{
		// Exact match filters (uses indexes better)
		$exactFilters = [
			'status' => 'quotation.status',
			'port_id' => 'quotation.port_id',
			'customer_id' => 'quotation.customer_id',
			'vessel_id' => 'quotation.vessel_id',
			'event_id' => 'quotation.event_id',
			'document_date' => 'quotation.document_date'
		];
	
		foreach ($exactFilters as $param => $column) {
			if (!empty($params[$param])) {
				$query->where($column, '=', $params[$param]);
			}
		}
	
		// Prefix match filters (better for LIKE queries)
		$prefixFilters = [
			'customer_ref' => 'quotation.customer_ref',
			'document_identity' => 'quotation.document_identity',
			'total_amount' => 'quotation.total_amount'
		];
	
		foreach ($prefixFilters as $param => $column) {
			if (!empty($params[$param])) {
				$query->where($column, 'like', '%' . $params[$param] . '%');
			}
		}
	
		// Date range filter
		if (!empty($params['start_date']) && !empty($params['end_date'])) {
			$query->whereBetween('quotation.document_date', [$params['start_date'], $params['end_date']]);
		} elseif (!empty($params['start_date'])) {
			$query->where('quotation.document_date', '>=', $params['start_date']);
		} elseif (!empty($params['end_date'])) {
			$query->where('quotation.document_date', '<=', $params['end_date']);
		}
	
		// Status updated by (if needed)
		if (!empty($params['status_updated_by'])) {
			$query->whereExists(function ($subQuery) use ($params) {
				$subQuery->select(DB::raw(1))
						->from('quotation_status')
						->whereColumn('quotation_status.quotation_id', 'quotation.quotation_id')
						->where('quotation_status.created_by', $params['status_updated_by'])
						->orderBy('quotation_status.created_at', 'desc')
						->limit(1);
			});
		}
	
		// Search filter (optimized)
		if (!empty($params['search'])) {
			$search = strtolower($params['search']);
			$query->where(function ($q) use ($search) {
				// First check indexed columns with prefix matching
				$q->where('quotation.customer_ref', 'like', $search . '%')
				  ->orWhere('quotation.document_identity', 'like', $search . '%')
				  ->orWhere('quotation.status', 'like', $search . '%');
				
				// Only check related tables if search term is long enough
				if (strlen($search) > 3) {
					$q->orWhereExists(function ($subQuery) use ($search) {
						$subQuery->select(DB::raw(1))
								->from('customer')
								->whereColumn('customer.customer_id', 'quotation.customer_id')
								->where('customer.name', 'like', '%' . $search . '%');
					})
					->orWhereExists(function ($subQuery) use ($search) {
						$subQuery->select(DB::raw(1))
								->from('vessel')
								->whereColumn('vessel.vessel_id', 'quotation.vessel_id')
								->where('vessel.name', 'like', '%' . $search . '%');
					})
					->orWhereExists(function ($subQuery) use ($search) {
						$subQuery->select(DB::raw(1))
								->from('port')
								->whereColumn('port.port_id', 'quotation.port_id')
								->where('port.name', 'like', '%' . $search . '%');
					})
					->orWhereExists(function ($subQuery) use ($search) {
						$subQuery->select(DB::raw(1))
								->from('event')
								->whereColumn('event.event_id', 'quotation.event_id')
								->where('event.event_code', 'like', '%' . $search . '%');
					});
				}
			});
		}
	}

	public function show($id, Request $request)
	{

		$data = Quotation::with(
			
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
			"person_incharge",
			// "quotation_detail.supplier",
			// "quotation_detail.unit",
			// "quotation_detail.product_type",
			// "quotation_detail.product"
		)
			->where('quotation_id', $id)->first();
		
		if (!$data) {
			return $this->jsonResponse(null, 404, "Quotation not found");
		}
		$data->quotation_detail = QuotationDetail::with([
			"product",
			"supplier",
			"unit",
			"product_type"
		])->where('quotation_id', $id)->orderBy('sort_order','DESC')->get();
	
		// Process quotation details
		$data->quotation_detail->each(function ($detail) use ($request) {
			// Calculate available quantity
			$chargeOrderQty = ChargeOrderDetail::where('quotation_detail_id', $detail->quotation_detail_id)
							->sum('quantity') ?? 0;
			$detail->available_quantity = ($detail->quantity ?? 0) - $chargeOrderQty;
			
			// Add stock info if product exists
			if ($detail->product) {
				$detail->product->stock = StockLedger::Check($detail->product, $request->all());
			}
		});

		// Process terms
		$terms = [];
		if (!empty($data->term_id)) {
			$termIds = json_decode($data->term_id, true) ?? [];
			$terms = Terms::whereIn('term_id', $termIds)
					->select('term_id as value', 'name as label')
					->get()
					->keyBy('value')
					->toArray();
		}
		$data['term_id'] = $terms;

		// Filter by available quantity if requested
		if ($request->hasAvailableQty) {
			$data->quotation_detail = $data->quotation_detail
				->filter(fn($detail) => ($detail->available_quantity ?? 0) > 0)
				->values();
		}

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
	
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");
	
		DB::beginTransaction(); // Start transaction
	
		try {
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
	
			DB::commit(); // Commit the transaction if everything went fine
	
			return $this->jsonResponse(['quotation_id' => $uuid], 200, "Add Quotation Successfully!");
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Quotation Store Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while saving Quotation.", 500, "Transaction Failed");
		}
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'quotation', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		DB::beginTransaction(); // Start transaction

		try {

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

		
						if ($value['row_status'] == 'I') {
							$DetailExist = QuotationDetail::where([
								'quotation_id'=>$id,
								'product_id'=>$value['product_id'] ?? "",
								'product_type_id'=>$value['product_type_id'] ?? "",
								'product_name'=>$value['product_name'] ?? "",
								'product_description'=>$value['product_description'] ?? "",
								'description'=>$value['description'] ?? "",
								'supplier_id'=>$value['supplier_id'] ?? "",
								'vendor_part_no'=>$value['vendor_part_no'] ?? "",
								'internal_notes'=>$value['internal_notes'] ?? "",
								'cost_price'=>$value['cost_price'] ?? "",
								'quantity'=>$value['quantity'] ?? "",
								'markup'=>$value['markup'] ?? "",
								'rate'=>$value['rate'] ?? "",
								'amount'=>$value['amount'] ?? "",
							])->exists();
							if($DetailExist) continue;
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
							// ✅ Lumen Log: Insert action
							Log::info('QuotationDetail inserted', [
								'quotation_detail_id' => $detail_uuid,
								'user_id' => $request->login_user_id,
								'backend_data' => $insertArr,
								'frontend_data' => $value
							]);
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
				
				}
			}
  		 	DB::commit(); // Success

			return $this->jsonResponse(['quotation_id' => $id], 200, "Update Quotation Successfully!");
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Quotation Update Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while updating Quotation.", 500, "Transaction Failed");
		}

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
