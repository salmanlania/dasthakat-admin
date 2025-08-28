<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\DocumentType;
use App\Models\GRN;
use App\Models\GRNDetail;
use App\Models\Picklist;
use App\Models\PicklistDetail;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\SaleInvoice;
use App\Models\SaleInvoiceDetail;
use App\Models\Shipment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SaleInvoiceController extends Controller
{
	protected $document_type_id = 51;
	protected $db;

	public function index(Request $request)
	{

		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$quotation_no = $request->input('quotation_no', '');
		$event_id = $request->input('event_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$charge_no = $request->input('charge_no', '');
		$sales_team_ids = $request->input('sales_team_ids', []);

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'sale_invoice.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = SaleInvoice::LeftJoin('charge_order as co', 'co.charge_order_id', '=', 'sale_invoice.charge_order_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'co.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'co.vessel_id')
			->LeftJoin('quotation as q', 'q.document_identity', '=', 'co.ref_document_identity')
			->LeftJoin('sales_team as st', 'st.sales_team_id', '=', 'e.sales_team_id');

		$data = $data->where('sale_invoice.company_id', '=', $request->company_id);
		$data = $data->where('sale_invoice.company_branch_id', '=', $request->company_branch_id);

		if (!empty($quotation_no)) $data = $data->where('q.document_identity', 'like', "%". $quotation_no."%");
		if (!empty($vessel_id)) $data = $data->where('co.vessel_id', '=',  $vessel_id);
		if (!empty($event_id)) $data = $data->where('co.event_id', '=',  $event_id);
		if (!empty($charge_no)) $data = $data->where('co.document_identity', 'like', "%". $charge_no."%");
		if (!empty($document_identity)) $data = $data->where('sale_invoice.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('sale_invoice.document_date', '=',  $document_date);
		if (!empty($sales_team_ids) && is_array($sales_team_ids)) {
			$data = $data->whereIn('e.sales_team_id', $sales_team_ids);
		}

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query

					->Where('co.document_identity', 'like', '%' . $search . '%')
					->Where('q.document_identity', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('st.name', 'like', '%' . $search . '%')
					->OrWhere('sale_invoice.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select(
			"sale_invoice.*", 
			"q.document_identity as quotation_no", 
			"co.document_identity as charge_no",
			"e.event_code",
			"v.name as vessel_name",
			"e.sales_team_id",
			"st.name as sales_team_name"
		);
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
        "charge_order.service_order",
        "charge_order.event",
        "charge_order.vessel",
        "charge_order.customer",
        "charge_order.flag",
        "charge_order.agent",
        "charge_order.port",
        "charge_order.quotation",
        "charge_order.quotation.payment"
    )->where('sale_invoice_id', $id)->first();

    if (!$data) {
        return $this->jsonResponse(null, 404, "Sale Invoice not found");
    }

    $data->shipment = Shipment::where('charge_order_id', $data->charge_order_id)
        ->orderBy('created_at', 'desc')
        ->first();

    // foreach ($data->sale_invoice_detail as &$detail) {
    //     if (!empty($detail->product_id)) {
    //         $product = Product::with('product_type')->where('product_id', $detail->product_id)->first();
    //         $detail->product_type = $product->product_type ?? null;
    //     } else {
    //         $detail->product_type = (object)[
    //             'product_type_id' => 4,
    //             'name' => "Others"
    //         ];
    //     }
    // }
	foreach ($data->sale_invoice_detail as $detail) {
	$Product = Product::with('product_type')->where('product_id', $detail->product_id)->first();
		if ($Product?->product_type_id == 2) {
			$detail->picklist_detail = PicklistDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)->first() ?? null;
			$detail->picklist = Picklist::where('picklist_id', $detail->picklist_detail->picklist_id)->first() ?? null;
		} else if ($Product?->product_type_id == 3 || $Product?->product_type_id != 1) {
			$detail->purchase_order_detail = PurchaseOrderDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)->first() ?? null;
			$detail->purchase_order = PurchaseOrder::where('purchase_order_id', $detail->purchase_order_detail->purchase_order_id)->first() ?? null;
		}
		$detail->product_type = $Product?->product_type ?? 
		(object)[
	        'product_type_id' => 4,
	        'name' => "Others"
		];
	}

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
		DB::beginTransaction();

		try{
		// 3. Fetch Reference Data
		$chargeOrder = ChargeOrder::with('charge_order_detail', 'vessel')->find($request->charge_order_id);
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
			'ship_date'         => $request->ship_date ?? "",
			'document_type_id'  => $document['document_type_id'] ?? "",
			'document_no'       => $document['document_no'] ?? "",
			'document_prefix'   => $document['document_prefix'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_date'     => $request->document_date ?? "",
			'vessel_billing_address' => $chargeOrder?->vessel?->billing_address ?? "",
			'charge_order_id'   => $request->charge_order_id,
			'created_at'        => Carbon::now(),
			'created_by'        => $request->login_user_id,
		];

		// 5. Loop Through Charge Order Details
		$totalQuantity = 0;
		$totalAmount = 0;
		$discountAmount = 0;
		$grossAmount = 0;
		$index = 0;
		if ($chargeOrder->charge_order_detail) {

			foreach ($chargeOrder->charge_order_detail as $detail) {
				if (isset($detail->charge_order_detail_id)) {
					$saleInvoiceDetail = SaleInvoiceDetail::where('charge_order_detail_id', $detail->charge_order_detail_id)->get();
					if ($this->getShipmentQuantity($detail) == $saleInvoiceDetail->sum('quantity')) {
						continue;
					}

					$actualQty = ($this->getShipmentQuantity($detail) - $saleInvoiceDetail->sum('quantity')) ?? 0;
					if ($actualQty <= 0) continue;

					$amount = $detail->rate * $actualQty;
					$totalQuantity += $actualQty;
					$totalAmount += $amount;
					$discountAmount += $detail->discount_amount ?? 0;
					$grossAmount += ($amount -  $detail->discount_amount);


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
						'discount_amount'          => $detail->discount_amount,
						'discount_percent'         => $detail->discount_percent,
						'gross_amount'            => $detail->gross_amount,
						'created_at'               => Carbon::now(),
						'created_by'               => $request->login_user_id,
					]);
				}
			}

			// 6. Finalize Invoice
			$invoiceData['total_quantity'] = $totalQuantity;
			$invoiceData['total_amount']   = $totalAmount;
			$invoiceData['total_discount'] = $discountAmount;
			$invoiceData['net_amount']     = $grossAmount;
		}

		if ($totalQuantity > 0) {
			SaleInvoice::create($invoiceData);
			DB::commit();

			return $this->jsonResponse(['sale_invoice_id' => $uuid], 200, "Add Sale Invoice Successfully!");
		} else {
			DB::rollBack(); // Rollback on error

			return $this->jsonResponse(['sale_invoice_id' => $uuid], 500, "Cannot generate invoice: No items with available quantity.");
		}
	} catch (\Exception $e) {
		DB::rollBack(); // Rollback on error
		Log::error('Sale Invoice Store Error: ' . $e->getMessage());
		return $this->jsonResponse("Something went wrong while saving Sale Invoice.", 500, "Transaction Failed");
	}
	}


	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'sale_invoice', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data  = SaleInvoice::find($id);
		$data->document_date = $request->document_date;
		$data->ship_date = $request->ship_date;
		$data->vessel_billing_address = $request->vessel_billing_address;
		$data->updated_at = Carbon::now();
		$data->updated_by = $request->login_user_id;
		$data->update();


		return $this->jsonResponse(['sale_invoice_id' => $id], 200, "Update Sale Invoice Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'sale_invoice', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = SaleInvoice::where('sale_invoice_id', $id)->first();
		if (!$data) return $this->jsonResponse(['sale_invoice_id' => $id], 404, "Sale Invoice Not Found!");
		$data->delete();
		SaleInvoiceDetail::where('sale_invoice_id', $id)->delete();
		return $this->jsonResponse(['sale_invoice_id' => $id], 200, "Delete Sale Invoice Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'sale_invoice', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->sale_invoice_ids) && !empty($request->sale_invoice_ids) && is_array($request->sale_invoice_ids)) {
				foreach ($request->sale_invoice_ids as $sale_invoice_id) {
					$user = SaleInvoice::where(['sale_invoice_id' => $sale_invoice_id])->first();
					$user->delete();
					SaleInvoiceDetail::where('sale_invoice_id', $sale_invoice_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Sale Invoice successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
