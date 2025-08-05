<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\DocumentType;
use App\Models\GRN;
use App\Models\GRNDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use App\Models\PurchaseReturnDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
		$customer_id = $request->input('customer_id', '');
		$charge_order_id = $request->input('charge_order_id', '');
		$charge_no = $request->input('charge_no', '');
		$event_id = $request->input('event_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$type = $request->input('type', '');
		$status = $request->input('grn_status', '');
		$is_deleted = $request->input('is_deleted',false);

		$search = $request->input('search', '');
		$page = $request->input('page', 1);
		$perPage = $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'purchase_order.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = PurchaseOrder::LeftJoin('supplier as s', 's.supplier_id', '=', 'purchase_order.supplier_id')
			->LeftJoin('quotation as q', 'q.quotation_id', '=', 'purchase_order.quotation_id')
			->LeftJoin('charge_order as co', 'co.charge_order_id', '=', 'purchase_order.charge_order_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'co.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'co.vessel_id')
			->LeftJoin('customer as c', 'c.customer_id', '=', 'e.customer_id');

		$data = $data->where('purchase_order.company_id', '=', $request->company_id);
		$data = $data->where('purchase_order.company_branch_id', '=', $request->company_branch_id);

		if (!empty($supplier_id)) $data->where('purchase_order.supplier_id', $supplier_id);
		if (!empty($quotation_id)) $data->where('purchase_order.quotation_id', $quotation_id);
		if (!empty($charge_order_id)) $data->where('purchase_order.charge_order_id', $charge_order_id);
		if (!empty($charge_no)) $data->where('co.document_identity', 'like', "%" . $charge_no . "%");
		if (!empty($document_identity)) $data->where('purchase_order.document_identity', 'like', "%$document_identity%");
		if (!empty($document_date)) $data->where('purchase_order.document_date', $document_date);
		if (!empty($required_date)) $data->where('purchase_order.required_date', $required_date);
		if (!empty($customer_id)) $data->where('c.customer_id', $customer_id);
		if (!empty($vessel_id)) $data->where('co.vessel_id', $vessel_id);
		if (!empty($event_id)) $data->where('co.event_id', $event_id);
		if (!empty($type)) $data->where('purchase_order.type', $type);
		if($is_deleted == true) $data = $data->where('purchase_order.is_deleted',$is_deleted);

		if (!empty($search)) {
			$search = strtolower($search);
			$data->where(function ($query) use ($search) {
				$query
					->where('s.name', 'like', "%$search%")
					->orWhere('purchase_order.type', 'like', "%$search%")
					->orWhere('q.document_identity', 'like', "%$search%")
					->orWhere('c.name', 'like', "%$search%")
					->orWhere('v.name', 'like', "%$search%")
					->orWhere('e.event_code', 'like', "%$search%")
					->orWhere('co.document_identity', 'like', "%$search%")
					->orWhere('purchase_order.document_identity', 'like', "%$search%");
			});
		}

		// **Filter Available POs where at least one product is not fully received**
		if ($request->has('available_po') && $request->available_po == 1) {

			$data->whereExists(function ($query) {
				$query->select(DB::raw(1))
					->from('purchase_order_detail as pod')
					->leftJoin('good_received_note as grn', 'grn.purchase_order_id', '=', 'pod.purchase_order_id')
					->leftJoin('good_received_note_detail as grnd', function ($join) {
						$join->on('grnd.good_received_note_id', '=', 'grn.good_received_note_id')
							->on('grnd.purchase_order_detail_id', '=', 'pod.purchase_order_detail_id'); // Match product
					})
					->leftJoin('purchase_return as pr', 'pr.purchase_order_id', '=', 'pod.purchase_order_id')
					->leftJoin('purchase_return_detail as prd', function ($join) {
						$join->on('prd.purchase_return_id', '=', 'pr.purchase_return_id')
							->on('prd.purchase_order_detail_id', '=', 'pod.purchase_order_detail_id');
					})
					->whereRaw('pod.purchase_order_id = purchase_order.purchase_order_id')
					->groupBy('pod.product_id', 'pod.quantity')
					->havingRaw("SUM(IFNULL(grnd.quantity, 0)) - SUM(IFNULL(prd.quantity, 0)) < pod.quantity");
			});
		}



		// $data = $data->select("purchase_order.*", 'c.name as customer_name', "s.name as supplier_name", "q.document_identity as quotation_no", "co.document_identity as charge_no")
		$data = $data->select(
			"purchase_order.*",
			DB::raw("CONCAT(purchase_order.document_identity , ' - ', e.event_code, ' (', v.name, ')') as purchase_order_no"),
			'c.name as customer_name',
			'e.event_code',
			'v.name as vessel_name',
			"s.name as supplier_name",
			"q.document_identity as quotation_no",
			"co.document_identity as charge_no",
			DB::raw(
				"
				CASE
					WHEN NOT EXISTS (
						SELECT 1
						FROM purchase_order_detail pod
						WHERE pod.purchase_order_id = purchase_order.purchase_order_id
					) THEN 3  -- No details exist
					WHEN NOT EXISTS (
						SELECT 1
						FROM good_received_note grn
						WHERE grn.purchase_order_id = purchase_order.purchase_order_id
					) THEN 3  -- Details exist but no GRN created
					WHEN EXISTS (
						SELECT 1
						FROM purchase_order_detail pod
						LEFT JOIN good_received_note grn ON grn.purchase_order_id = pod.purchase_order_id
						LEFT JOIN good_received_note_detail grnd 
							ON grnd.good_received_note_id = grn.good_received_note_id 
							AND grnd.product_id = pod.product_id
						WHERE pod.purchase_order_id = purchase_order.purchase_order_id
						GROUP BY pod.product_id, pod.quantity
						HAVING SUM(IFNULL(grnd.quantity, 0)) < pod.quantity
					) THEN 2  -- Some items received but not all
					ELSE 1  -- All items fully received
				END AS grn_status"
			)
		);

		// **Apply Status Filter if Provided**
		if (!empty($status)) {
			$data->whereRaw(
				"
				CASE
					WHEN NOT EXISTS (
						SELECT 1
						FROM purchase_order_detail pod
						WHERE pod.purchase_order_id = purchase_order.purchase_order_id
					) THEN 3  -- No details exist (in_progress)
					WHEN NOT EXISTS (
						SELECT 1
						FROM good_received_note grn
						WHERE grn.purchase_order_id = purchase_order.purchase_order_id
					) THEN 3  -- Details exist but no GRN created (in_progress)
					WHEN EXISTS (
						SELECT 1
						FROM purchase_order_detail pod
						LEFT JOIN good_received_note grn ON grn.purchase_order_id = pod.purchase_order_id
						LEFT JOIN good_received_note_detail grnd 
							ON grnd.good_received_note_id = grn.good_received_note_id 
							AND grnd.product_id = pod.product_id
						WHERE pod.purchase_order_id = purchase_order.purchase_order_id
						GROUP BY pod.product_id, pod.quantity
						HAVING SUM(IFNULL(grnd.quantity, 0)) < pod.quantity
					) THEN 2  -- Partial receipt
					ELSE 1  -- Fully received (completed)
				END = ?",
				[$status]
			);
		}
		$data = $data->orderBy($sort_column, $sort_direction)
			->paginate($perPage, ['*'], 'page', $page);


		return response()->json($data);
	}


	public function show($id, Request $request)
	{
		// Main query with all eager loading
		$data = PurchaseOrder::with([
			"user",
			"payment",
			"supplier",
			"quotation",
			"charge_order",
			"charge_order.event",
			"charge_order.vessel",
			"charge_order.customer",
			"purchase_order_detail.product",
			"purchase_order_detail.product_type",
			"purchase_order_detail.unit",
		])->where('purchase_order_id', $id)->first();

		if (!$data) {
			return $this->jsonResponse(null, 404, "Purchase Order not found");
		}

		foreach ($data->purchase_order_detail as &$detail) {

			$GRN = GRNDetail::where('purchase_order_detail_id', $detail->purchase_order_detail_id);
			$PRD = PurchaseReturnDetail::where('purchase_order_detail_id', $detail->purchase_order_detail_id);

			$receivedQty = $GRN->sum('quantity') - $PRD->sum('quantity');
			$remainingQty = max($detail->quantity - $receivedQty, 0);

			$detail->available_quantity = $remainingQty;
			$detail->received_quantity = $receivedQty;
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


	public function actions(Request $request)
	{
		if (!isPermission('cancel', 'purchase_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$is_deleted = $request->is_deleted ?? false;
		$id = $request->id;

		if (empty($id)) {
			return $this->jsonResponse("No Purchase Order Selected!", 400, "Request Failed");
		}


		if (!GRN::where('purchase_order_id', $id)->exists() && $is_deleted) {

			PurchaseOrder::where('purchase_order_id', $id)->update(['is_deleted' => 1]);
			
			return $this->jsonResponse("Purchase Order Cancelled Successfully!", 200, "Success");
		}else{
			return $this->jsonResponse("Cannot cancel Purchase Order with existing GRN!", 400, "Request Failed");
		}
	}

	public function store(Request $request)
	{

		if (!isPermission('add', 'purchase_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		DB::beginTransaction();
		try {

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
				'created_at' => Carbon::now(),
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
						'product_description' => $value['product_description'] ?? "",
						'description' => $value['description'] ?? "",
						'vpart' => $value['vpart'] ?? "",
						'unit_id' => $value['unit_id'] ?? "",
						'supplier_id' => $value['supplier_id'] ?? "",
						'quantity' => $value['quantity'] ?? "",
						'rate' => $value['rate'] ?? "",
						'amount' => $value['amount'] ?? "",
						'vendor_notes' => $value['vendor_notes'] ?? "",
						'created_at' => Carbon::now(),
						'created_by' => $request->login_user_id,
					];

					PurchaseOrderDetail::create($insert);
				}
			}

			DB::commit();
			return $this->jsonResponse(['purchase_order_id' => $uuid], 200, "Add Purchase Order Successfully!");
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Purchase Order Store Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while saving Purchase Order.", 500, "Transaction Failed");
		}
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'purchase_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		DB::beginTransaction();
		try {
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
			$data->updated_at = Carbon::now();
			$data->updated_by = $request->login_user_id;

			if ($request->purchase_order_detail) {
				$data->save();
				foreach ($request->purchase_order_detail as $value) {
					if ($value['row_status'] == 'I') {
						$detail_uuid = $this->get_uuid();
						$insert = [
							'purchase_order_id' => $id,
							'purchase_order_detail_id' => $detail_uuid,
							'sort_order' => $value['sort_order'] ?? 0,
							'product_id' => $value['product_id'] ?? "",
							'product_type_id' => $value['product_type_id'] ?? "",
							'charge_order_detail_id' => $value['charge_order_detail_id'] ?? "",
							'product_name' => $value['product_name'] ?? "",
							'product_description' => $value['product_description'] ?? "",
							'description' => $value['description'] ?? "",
							'vpart' => $value['vpart'] ?? "",
							'unit_id' => $value['unit_id'] ?? "",
							'quantity' => $value['quantity'] ?? "",
							'rate' => $value['rate'] ?? "",
							'amount' => $value['amount'] ?? "",
							'vendor_notes' => $value['vendor_notes'] ?? "",
							'created_at' => Carbon::now(),
							'created_by' => $request->login_user_id,
						];
						PurchaseOrderDetail::create($insert);
					}
					if ($value['row_status'] == 'U') {
						$update = [
							'sort_order' => $value['sort_order'] ?? 0,
							'product_id' => $value['product_id'] ?? "",
							'product_type_id' => $value['product_type_id'] ?? "",
							'charge_order_detail_id' => $value['charge_order_detail_id'] ?? "",
							'product_name' => $value['product_name'] ?? "",
							'product_description' => $value['product_description'] ?? "",
							'description' => $value['description'] ?? "",
							'vpart' => $value['vpart'] ?? "",
							'unit_id' => $value['unit_id'] ?? "",
							'quantity' => $value['quantity'] ?? "",
							'rate' => $value['rate'] ?? "",
							'amount' => $value['amount'] ?? "",
							'vendor_notes' => $value['vendor_notes'] ?? "",
							'updated_at' => Carbon::now(),
							'updated_by' => $request->login_user_id,
						];
						PurchaseOrderDetail::where('purchase_order_detail_id', $value['purchase_order_detail_id'])->update($update);

						// Update Charge Order Detail if linked
						if (!empty($value['charge_order_detail_id'])) {
							$chargeOrderDetail = ChargeOrderDetail::where('charge_order_detail_id', $value['charge_order_detail_id']);
							$data = $chargeOrderDetail->first();
							$quantity = $value['quantity'] ?? 0;
							$rate = $data->rate ?? 0;
							$amount = $quantity * $rate;
							$discount_percent = $data->discount_percent ?? 0;
							$discount_amount = ($amount * $discount_percent) / 100;
							$gross_amount = $amount - $discount_amount;

							$chargeOrderDetail->update([
								'quantity' => $quantity,
								'rate' => $rate,
								'amount' => $amount,
								'discount_percent' => $discount_percent,
								'discount_amount' => $discount_amount,
								'gross_amount' => $gross_amount
							]);
						}
					}
					if ($value['row_status'] == 'D') {
						PurchaseOrderDetail::where('purchase_order_detail_id', $value['purchase_order_detail_id'])->delete();
					}
				}
				if (!empty($request->charge_order_id)) {
					$data = ChargeOrder::where('charge_order_id', $request->charge_order_id)->first();
					$detail = ChargeOrderDetail::where('charge_order_id', $request->charge_order_id);
					$data->total_quantity = $detail->sum('quantity');
					$data->total_amount = $detail->sum('amount');
					$data->discount_amount = $detail->sum('discount_amount');
					$data->net_amount = $detail->sum('gross_amount');
					$data->update();
				}
			}
			DB::commit();

			return $this->jsonResponse(['purchase_order_id' => $id], 200, "Update Purchase Order Successfully!");
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Purchase Order Updating Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while updating Purchase Order.", 500, "Transaction Failed");
		}
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'purchase_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = PurchaseOrder::where('purchase_order_id', $id)->first();
		if (!$data) return $this->jsonResponse(['purchase_order_id' => $id], 404, "Purchase Order Not Found!");

		$validate = [
			'main' => [
				'check' => new PurchaseOrder,
				'id' => $id,
			],
			'with' => [
				['model' => new GRN],
			]
		];

		$response = $this->checkAndDelete($validate);
		if ($response['error']) {
			return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
		}

		$purchaseOrderDetailIds = PurchaseOrderDetail::where('purchase_order_id', $id)->pluck('purchase_order_detail_id');

		// Update ChargeOrderDetail to set editable to true for the associated items
		// ChargeOrderDetail::whereIn('purchase_order_detail_id', $purchaseOrderDetailIds)
		// 	->update([
		// 		'purchase_order_id' => null,
		// 		'purchase_order_detail_id' => null,
		// 	]);

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

					$validate = [
						'main' => [
							'check' => new PurchaseOrder,
							'id' => $purchase_order_id,
						],
						'with' => [
							['model' => new GRN],
						]
					];

					$response = $this->checkAndDelete($validate);
					if ($response['error']) {
						return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
					}

					// $purchaseOrderDetailIds = PurchaseOrderDetail::where('purchase_order_id', $purchase_order_id)->pluck('purchase_order_detail_id');

					// Update ChargeOrderDetail to set editable to true for the associated items
					// ChargeOrderDetail::whereIn('purchase_order_detail_id', $purchaseOrderDetailIds)
					// 	->update([
					// 		'purchase_order_id' => null,
					// 		'purchase_order_detail_id' => null,
					// 	]);
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
