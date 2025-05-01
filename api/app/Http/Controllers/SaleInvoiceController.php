<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\DocumentType;
use App\Models\GRN;
use App\Models\GRNDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseInvoiceDetail;
use App\Models\PurchaseOrder;
use App\Models\SaleInvoice;
use App\Models\SaleInvoiceDetail;
use Carbon\Carbon;

class SaleInvoiceController extends Controller
{
	protected $document_type_id = 51;
	protected $db;

	public function index(Request $request)
	{

		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$quotation_id = $request->input('quotation_id', '');
		$charge_order_id = $request->input('charge_order_id', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'sale_invoice.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = SaleInvoice::LeftJoin('charge_order as co', 'co.charge_order_id', '=', 'sale_invoice.charge_order_id')
			->LeftJoin('quotation as q', 'q.document_identity', '=', 'co.ref_document_identity');

		$data = $data->where('sale_invoice.company_id', '=', $request->company_id);
		$data = $data->where('sale_invoice.company_branch_id', '=', $request->company_branch_id);

		if (!empty($quotation_id)) $data = $data->where('sale_invoice.quotation_id', '=',  $quotation_id);
		if (!empty($charge_order_id)) $data = $data->where('sale_invoice.charge_order_id', '=',  $charge_order_id);
		if (!empty($document_identity)) $data = $data->where('sale_invoice.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('sale_invoice.document_date', '=',  $document_date);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query

					->Where('co.document_identity', 'like', '%' . $search . '%')
					->OrWhere('q.document_identity', 'like', '%' . $search . '%')

					->OrWhere('sale_invoice.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("sale_invoice.*", "q.document_identity as quotation_no", "co.document_identity as charge_no");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = SaleInvoice::with(
			"sale_invoice_detail",
			"sale_invoice_detail.charge_order_detail",
			"sale_invoice_detail.product",
			"sale_invoice_detail.unit",
			"charge_order",
			"charge_order.salesman",
			"charge_order.event",
			"charge_order.vessel",
			"charge_order.customer",
			"charge_order.flag",
			"charge_order.agent",
			"charge_order.port",
			"charge_order.quotation",
		)
			->where('sale_invoice_id', $id)->first();

		return $this->jsonResponse($data, 200, "Sale Invoice Data");
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
		// 1. Permission Check
		if (!isPermission('add', 'sale_invoice', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		// 2. Validation
		$validationError = $this->validateRequest($request->all());
		if (!empty($validationError)) {
			return $this->jsonResponse($validationError, 400, "Request Failed!");
		}

		// 3. Fetch Reference Data
		$chargeOrder = ChargeOrder::with('charge_order_detail')->find($request->charge_order_id);
		if (!$chargeOrder) {
			return $this->jsonResponse('Charge Order not found.', 404);
		}

		// 4. Prepare Invoice Meta Data
		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);

		$invoiceData = [
			'sale_invoice_id'   => $uuid,
			'company_id'        => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'document_type_id'  => $document['document_type_id'] ?? "",
			'document_no'       => $document['document_no'] ?? "",
			'document_prefix'   => $document['document_prefix'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_date'     => $request->document_date ?? "",
			'charge_order_id'   => $request->charge_order_id,
			'created_at'        => Carbon::now(),
			'created_by'        => $request->login_user_id,
		];

		// 5. Loop Through Charge Order Details
		$totalQuantity = 0;
		$totalAmount = 0;
		$index = 0;
		if ($chargeOrder->charge_order_detail) {

			foreach ($chargeOrder->charge_order_detail as $detail) {
				if($detail->charge_order_detail_id){

				if (SaleInvoiceDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)->exists()) {
					continue;
				}

				$actualQty = $this->getShipmentQuantity($detail->charge_order_detail_id) ?? 0;
				if ($actualQty <= 0) continue;

				$amount = $detail->rate * $actualQty;
				$totalQuantity += $actualQty;
				$totalAmount += $amount;

				SaleInvoiceDetail::create([
					'sale_invoice_detail_id'   => $this->get_uuid(),
					'sale_invoice_id'          => $uuid,
					'charge_order_detail_id'   => $detail->charge_order_detail_id,
					'sort_order'               => $index++,
					'product_id'               => $detail->product_id,
					'product_name'             => $detail->product_name,
					'product_description'      => $detail->product_description,
					'description'              => $detail->description,
					'unit_id'                  => $detail->unit_id,
					'quantity'                 => $actualQty,
					'rate'                     => $detail->rate,
					'amount'                   => $amount,
					'created_at'               => Carbon::now(),
					'created_by'               => $request->login_user_id,
				]);
			}
			}

			// 6. Finalize Invoice
			$invoiceData['total_quantity'] = $totalQuantity;
			$invoiceData['total_amount']   = $totalAmount;
			SaleInvoice::create($invoiceData);
		}

		return $this->jsonResponse(['sale_invoice_id' => $uuid], 200, "Add Sale Invoice Successfully!");
	}


	// public function update(Request $request, $id)
	// {
	// 	if (!isPermission('edit', 'sale_invoice', $request->permission_list))
	// 		return $this->jsonResponse('Permission Denied!', 403, "No Permission");


	// 	// Validation Rules
	// 	$isError = $this->validateRequest($request->all(), $id);
	// 	if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

	// 	$ref  = PurchaseOrder::where('purchase_order_id', $request->purchase_order_id)->first();

	// 	$data  = PurchaseInvoice::where('purchase_invoice_id', $id)->first();
	// 	$data->company_id = $request->company_id;
	// 	$data->company_branch_id = $request->company_branch_id;
	// 	$data->document_date = $request->document_date;
	// 	$data->required_date = $request->required_date;
	// 	$data->supplier_id = $request->supplier_id;
	// 	$data->buyer_id = $request->buyer_id;
	// 	$data->ship_via = $request->ship_via;
	// 	$data->ship_to = $request->ship_to;
	// 	$data->department = $request->department;
	// 	$data->charge_order_id = $ref->charge_order_id;
	// 	$data->purchase_order_id = $request->purchase_order_id;
	// 	$data->payment_id = $request->payment_id;
	// 	$data->remarks = $request->remarks;
	// 	$data->total_quantity = $request->total_quantity;
	// 	$data->total_amount = $request->total_amount;
	// 	$data->updated_at = Carbon::now();
	// 	$data->updated_by = $request->login_user_id;
	// 	$data->update();
	// 	PurchaseInvoiceDetail::where('purchase_invoice_id', $id)->delete();
	// 	if ($request->purchase_invoice_detail) {

	// 		foreach ($request->purchase_invoice_detail as $key => $value) {
	// 			$detail_uuid = $this->get_uuid();

	// 			$insertArr = [
	// 				'purchase_invoice_id' => $id,
	// 				'purchase_invoice_detail_id' => $detail_uuid,
	// 				'charge_order_detail_id' => $value->charge_order_detail_id ?? "",
	// 				'sort_order' => $value['sort_order'] ?? "",
	// 				'product_id' => $value['product_id'] ?? "",
	// 				'product_name' => $value['product_name'] ?? "",
	// 				'product_description' => $value['product_description'] ?? "",
	// 				'description' => $value['description'] ?? "",
	// 				'vpart' => $value['vpart'] ?? "",
	// 				'unit_id' => $value['unit_id'] ?? "",
	// 				'quantity' => $value['quantity'] ?? "",
	// 				'rate' => $value['rate'] ?? "",
	// 				'amount' => $value['amount'] ?? "",
	// 				'vendor_notes' => $value['vendor_notes'] ?? "",
	// 				'created_at' => Carbon::now(),
	// 				'created_by' => $request->login_user_id,
	// 			];
	// 			PurchaseInvoiceDetail::create($insertArr);
	// 		}
	// 	}


	// 	return $this->jsonResponse(['purchase_invoice_id' => $id], 200, "Update Purchase Invoice Successfully!");
	// }
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'sale_invoice', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = PurchaseInvoice::where('purchase_invoice_id', $id)->first();
		if (!$data) return $this->jsonResponse(['purchase_invoice_id' => $id], 404, "Purchase Invoice Not Found!");
		$data->delete();
		PurchaseInvoiceDetail::where('purchase_invoice_id', $id)->delete();
		return $this->jsonResponse(['purchase_invoice_id' => $id], 200, "Delete Purchase Invoice Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'sale_invoice', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->purchase_invoice_ids) && !empty($request->purchase_invoice_ids) && is_array($request->purchase_invoice_ids)) {
				foreach ($request->purchase_invoice_ids as $purchase_invoice_id) {
					$user = PurchaseInvoice::where(['purchase_invoice_id' => $purchase_invoice_id])->first();
					$user->delete();
					PurchaseInvoiceDetail::where('purchase_invoice_id', $purchase_invoice_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Purchase Invoice successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
