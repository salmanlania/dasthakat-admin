<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\DocumentType;
use App\Models\GRN;
use App\Models\GRNDetail;
use App\Models\Ledger;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseInvoiceDetail;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use App\Models\Setting;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PDO;

class PurchaseInvoiceController extends Controller
{
	protected $document_type_id = 42;
	protected $db;

	public function index(Request $request)
	{
		$supplier_id = $request->input('supplier_id', '');
		$document_identity = $request->input('document_identity', '');
		$ship_via = $request->input('ship_via', '');
		$document_date = $request->input('document_date', '');
		$required_date = $request->input('required_date', '');
		$quotation_no = $request->input('quotation_no', '');
		$purchase_order_no = $request->input('purchase_order_no', '');
		$charge_no = $request->input('charge_no', '');
		$purchase_order_id = $request->input('purchase_order_id', '');
		$sales_team_ids = $request->input('sales_team_ids', []);

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'purchase_invoice.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = PurchaseInvoice::LeftJoin('supplier as s', 's.supplier_id', '=', 'purchase_invoice.supplier_id')
			->LeftJoin('charge_order as co', 'co.charge_order_id', '=', 'purchase_invoice.charge_order_id')
			->LeftJoin('quotation as q', 'q.document_identity', '=', 'co.ref_document_identity')
			->LeftJoin('purchase_order as po', 'po.purchase_order_id', '=', 'purchase_invoice.purchase_order_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'co.event_id')
			->LeftJoin('sales_team as st', 'st.sales_team_id', '=', 'e.sales_team_id');
		$data = $data->where('purchase_invoice.company_id', '=', $request->company_id);
		$data = $data->where('purchase_invoice.company_branch_id', '=', $request->company_branch_id);

		if (!empty($supplier_id)) $data = $data->where('purchase_invoice.supplier_id', '=',  $supplier_id);
		if (!empty($purchase_order_id)) $data = $data->where('purchase_invoice.purchase_order_id', '=',  $purchase_order_id);
		if (!empty($quotation_no)) $data = $data->where('q.document_identity', 'like',  '%' . $quotation_no . '%');
		if (!empty($charge_no)) $data = $data->where('co.document_identity', 'like', '%' . $charge_no . '%');
		if (!empty($purchase_order_no)) $data = $data->where('po.document_identity', 'like', '%' . $purchase_order_no . '%');
		if (!empty($document_identity)) $data = $data->where('purchase_invoice.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($ship_via)) $data = $data->where('po.ship_via', 'like', '%' . $ship_via . '%');
		if (!empty($document_date)) $data = $data->where('purchase_invoice.document_date', '=',  $document_date);
		if (!empty($required_date)) $data = $data->where('purchase_invoice.required_date', '=',  $required_date);
		if (!empty($sales_team_ids) && is_array($sales_team_ids)) {
			$data = $data->whereIn('e.sales_team_id', $sales_team_ids);
		}

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('s.name', 'like', '%' . $search . '%')
					->OrWhere('po.ship_via', 'like', '%' . $search . '%')
					->OrWhere('co.document_identity', 'like', '%' . $search . '%')
					->OrWhere('q.document_identity', 'like', '%' . $search . '%')
					->OrWhere('po.document_identity', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('st.name', 'like', '%' . $search . '%')
					->OrWhere('purchase_invoice.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select(
			"purchase_invoice.*",
			"s.name as supplier_name",
			"q.document_identity as quotation_no",
			"co.document_identity as charge_no",
			"po.document_identity as purchase_order_no",
			"e.event_code",
			"e.sales_team_id",
			"st.name as sales_team_name"
		);
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
		foreach ($data as &$item) {
			if (!empty($item->supplier_id)) {
				continue;
			}
			$PR = PurchaseOrder::where('purchase_order_id', $item->purchase_order_id)->first();
			if ($PR->supplier_id) {
				$Sr = Supplier::where('supplier_id', $PR->supplier_id)->first();
				$item->supplier_name = $Sr->name ?? "";
			}
		}
		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = PurchaseInvoice::with(
			"purchase_invoice_detail.product",
			"purchase_invoice_detail.unit",
			"user",
			"payment",
			"supplier",
			"charge_order",
			"charge_order.quotation",
			"purchase_order",
			"purchase_order.supplier",
		)
			->where('purchase_invoice_id', $id)->first();

		foreach ($data->purchase_invoice_detail as &$detail) {

			$GRND = GRNDetail::where('purchase_order_detail_id', $detail->purchase_order_detail_id)->orderby('created_by')->first();

			if ($GRND) {
				$grn = GRN::where('good_received_note_id', $GRND->good_received_note_id)->first();
				$grnDate = $grn?->document_date ?? "";
				$detail->grn_date = $grnDate;
			}

			$PurchaseOrderDetail = PurchaseOrderDetail::where('purchase_order_detail_id', $detail->purchase_order_detail_id)->first();
			unset($detail->po_price);
			$detail->po_price = $PurchaseOrderDetail->rate ?? 0;
		}

		return $this->jsonResponse($data, 200, "Purchase Invoice Data");
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
		if (!isPermission('add', 'purchase_invoice', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		// 2. Validate Request
		$validationError = $this->validateRequest($request->all());
		if (!empty($validationError)) {
			return $this->jsonResponse($validationError, 400, "Request Failed!");
		}
		DB::beginTransaction();
		try {
			// 3. Fetch Related Purchase Order
			$purchaseOrder = PurchaseOrder::with('purchase_order_detail')
				->find($request->purchase_order_id);


			// $outstanding_account_id = Supplier::where('supplier_id', $purchaseOrder->supplier_id)->pluck('outstanding_account_id')->first();
			// $freight_account_id = Setting::where('module', 'inventory_accounts_setting')->where('field', 'purchase_freight_account')->value('value');
			// $freight_account = Setting::where('module', 'inventory_accounts_setting')
			// 	->where('field', 'sale_freight_account')
			// 	->value('value');

			// $freight_account_id = is_string($freight_account)
			// 	? json_decode($freight_account, true)[0] ?? null
			// 	: null;


			$base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
			$default_currency_id = Currency::where('company_id', $request->company_id)->where('company_branch_id', $request->company_branch_id)->value('currency_id');
			$conversion_rate = 1;

			if (!$purchaseOrder) return $this->jsonResponse('Purchase Order not found.', 404);
			// if (empty($outstanding_account_id)) return $this->jsonResponse(null, 400, "Customer Outstanding Account not found");
			// if (empty($freight_account_id)) return $this->jsonResponse(null, 400, "Freight Account not found");

			// 4. Prepare Invoice Header Data
			$uuid = $this->get_uuid();
			$document = DocumentType::getNextDocument($this->document_type_id, $request);

			$invoiceData = [
				'purchase_invoice_id' => $uuid,
				'company_id'          => $request->company_id ?? "",
				'company_branch_id'   => $request->company_branch_id ?? "",
				'document_type_id'    => $document['document_type_id'] ?? "",
				'document_no'         => $document['document_no'] ?? "",
				'document_prefix'     => $document['document_prefix'] ?? "",
				'document_identity'   => $document['document_identity'] ?? "",
				'document_date'       => $purchaseOrder->document_date ?? "",
				'vendor_invoice_no'   => $purchaseOrder->vendor_invoice_no ?? "",
				'required_date'       => $purchaseOrder->required_date ?? "",
				'supplier_id'         => $purchaseOrder->supplier_id ?? "",
				'buyer_id'            => $purchaseOrder->buyer_id ?? "",
				'ship_via'            => $purchaseOrder->ship_via ?? "",
				'ship_to'             => $purchaseOrder->ship_to ?? "",
				'department'          => $purchaseOrder->department ?? "",
				'charge_order_id'     => $purchaseOrder->charge_order_id ?? "",
				'purchase_order_id'   => $purchaseOrder->purchase_order_id ?? "",
				'payment_id'          => $purchaseOrder->payment_id ?? "",
				'remarks'             => $purchaseOrder->remarks ?? "",
				'freight'             => $purchaseOrder->freight ?? "",
				'created_at'          => Carbon::now(),
				'created_by'          => $request->login_user_id,
			];

			// 5. Process Line Items
			$totalQuantity = 0;
			$totalAmount = 0;
			$sortIndex = 0;

			foreach ($purchaseOrder->purchase_order_detail as $detail) {
				if (PurchaseInvoiceDetail::where('purchase_order_detail_id', $detail->purchase_order_detail_id)->exists()) {
					continue;
				}

				$grnQty = GRNDetail::where('purchase_order_detail_id', $detail->purchase_order_detail_id)->sum('quantity') ?? 0;
				if ($grnQty <= 0) continue;

				$amount = $detail->rate * $grnQty;
				$totalQuantity += $grnQty;
				$totalAmount += $amount;
				$detail_id = $this->get_uuid();
				$product = Product::where('product_id', $detail->product_id)->first();
				// $inventory_account_id = $product->inventory_account_id;

				PurchaseInvoiceDetail::create([
					'purchase_invoice_detail_id' => $detail_id,
					'purchase_invoice_id'        => $uuid,
					'charge_order_detail_id'     => $detail->charge_order_detail_id ?? "",
					'purchase_order_detail_id'   => $detail->purchase_order_detail_id ?? "",
					'sort_order'                 => $sortIndex++,
					'product_id'                 => $detail->product_id ?? "",
					'product_name'               => $detail->product_name ?? "",
					'product_description'        => $detail->product_description ?? "",
					'description'                => $detail->description ?? "",
					'vpart'                      => $detail->vpart ?? "",
					'unit_id'                    => $detail->unit_id ?? "",
					'po_price'                   => $detail->rate,
					'quantity'                   => $grnQty,
					'rate'                       => $detail->rate ?? 0,
					'amount'                     => $amount,
					'vendor_notes'               => $detail->vendor_notes ?? "",
					'created_at'                 => Carbon::now(),
					'created_by'                 => $request->login_user_id,
				]);

				// Ledger::create([
				// 	'ledger_id' => $this->get_uuid(),
				// 	'company_id' => $request->company_id,
				// 	'company_branch_id' => $request->company_branch_id,
				// 	'document_type_id' => $this->document_type_id,
				// 	'document_id' => $uuid,
				// 	'document_detail_id' => $detail_id,
				// 	'document_identity' => $document['document_identity'] ?? "",
				// 	'document_date' => $request->document_date ?? "",
				// 	'sort_order' => $detail->sort_order + 2,
				// 	'partner_type' => '',
				// 	'partner_id' => '',
				// 	'ref_document_type_id' => $purchaseOrder->document_type_id,
				// 	'ref_document_identity' => $purchaseOrder->document_identity,
				// 	'account_id' => $inventory_account_id ?? null,
				// 	'remarks' => '',
				// 	'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
				// 	'document_debit' => $amount ?? "",
				// 	'document_credit' => 0,
				// 	'base_currency_id' => $base_currency_id,
				// 	'conversion_rate' => $conversion_rate,
				// 	'debit' => ($amount ?? 0) * $conversion_rate,
				// 	'credit' => 0,
				// 	'document_amount' => $amount ?? "",
				// 	'amount' => ($amount ?? 0) * $conversion_rate,
				// 	'created_at' => Carbon::now(),
				// 	'created_by_id' => $request->login_user_id,
				// ]);
			}

			// 6. Finalize and Save Invoice
			$invoiceData['total_quantity'] = $totalQuantity;
			$invoiceData['total_amount'] = $totalAmount;
			$invoiceData['net_amount'] = $totalAmount;
			if ($totalQuantity > 0) {
				PurchaseInvoice::create($invoiceData);

				// Ledger::create([
				// 	'ledger_id' => $this->get_uuid(),
				// 	'company_id' => $request->company_id,
				// 	'company_branch_id' => $request->company_branch_id,
				// 	'document_type_id' => $this->document_type_id,
				// 	'document_id' => $uuid,
				// 	'document_detail_id' => "",
				// 	'document_identity' => $document['document_identity'] ?? "",
				// 	'document_date' => $request->document_date ?? "",
				// 	'sort_order' => 0,
				// 	'partner_type' => 'Vendor',
				// 	'partner_id' => $request->supplier_id,
				// 	'ref_document_type_id' => $purchaseOrder->document_type_id,
				// 	'ref_document_identity' => $purchaseOrder->document_identity,
				// 	'account_id' => $outstanding_account_id ?? null,
				// 	'remarks' => '',
				// 	'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
				// 	'document_debit' => $invoiceData['net_amount'] ?? "",
				// 	'document_credit' => 0,
				// 	'base_currency_id' => $base_currency_id,
				// 	'conversion_rate' => $conversion_rate,
				// 	'debit' => ($invoiceData['net_amount'] ?? 0) * $conversion_rate,
				// 	'credit' => 0,
				// 	'document_amount' => $invoiceData['net_amount'] ?? "",
				// 	'amount' => ($invoiceData['net_amount'] ?? 0) * $conversion_rate,
				// 	'created_at' => Carbon::now(),
				// 	'created_by_id' => $request->login_user_id,
				// ]);
				// if ((float)$purchaseOrder->freight > 0) {
				// 	Ledger::create([
				// 		'ledger_id' => $this->get_uuid(),
				// 		'company_id' => $request->company_id,
				// 		'company_branch_id' => $request->company_branch_id,
				// 		'document_type_id' => $this->document_type_id,
				// 		'document_id' => $uuid,
				// 		'document_detail_id' => "",
				// 		'document_identity' => $document['document_identity'] ?? "",
				// 		'document_date' => $request->document_date ?? "",
				// 		'sort_order' => 1,
				// 		'partner_type' => '',
				// 		'partner_id' => '',
				// 		'ref_document_type_id' => $purchaseOrder->document_type_id,
				// 		'ref_document_identity' => $purchaseOrder->document_identity,
				// 		'account_id' => $freight_account_id ?? null,
				// 		'remarks' => '',
				// 		'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
				// 		'document_debit' => $purchaseOrder->freight ?? "",
				// 		'document_credit' => 0,
				// 		'base_currency_id' => $base_currency_id,
				// 		'conversion_rate' => $conversion_rate,
				// 		'debit' => ($purchaseOrder->freight ?? 0) * $conversion_rate,
				// 		'credit' => 0,
				// 		'document_amount' => $purchaseOrder->freight ?? "",
				// 		'amount' => ($purchaseOrder->freight ?? 0) * $conversion_rate,
				// 		'created_at' => Carbon::now(),
				// 		'created_by_id' => $request->login_user_id,
				// 	]);
				// }

				DB::commit(); // Rollback on error
				return $this->jsonResponse(['purchase_invoice_id' => $uuid], 200, "Add Purchase Invoice Successfully!");
			} else {
				DB::rollBack(); // Rollback on error
				return $this->jsonResponse(['purchase_invoice_id' => $uuid], 500, "Cannot generate invoice: No items with available quantity.");
			}
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Purchase Invoice Store Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while saving Purchase Invoice.", 500, "Transaction Failed");
		}
	}


	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'purchase_invoice', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$purchaseOrder = PurchaseOrder::with('purchase_order_detail')->find($request->purchase_order_id);
		// $outstanding_account_id = Supplier::where('supplier_id', $purchaseOrder->supplier_id)->pluck('outstanding_account_id')->first();
		// $freight_account_id = Setting::where('module', 'inventory_accounts_setting')->where('field', 'purchase_freight_account')->value('value');

		$base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
		$default_currency_id = Currency::where('company_id', $request->company_id)->where('company_branch_id', $request->company_branch_id)->value('currency_id');
		$conversion_rate = 1;

		if (!$purchaseOrder) return $this->jsonResponse('Purchase Order not found.', 404);
		// if (empty($outstanding_account_id)) return $this->jsonResponse(null, 400, "Customer Outstanding Account not found");
		// if (empty($freight_account_id)) return $this->jsonResponse(null, 400, "Freight Account not found");

		DB::beginTransaction();
		try {
			$data  = PurchaseInvoice::where('purchase_invoice_id', $id)->first();
			$data->company_id = $request->company_id;
			$data->company_branch_id = $request->company_branch_id;
			$data->document_date = $request->document_date;
			$data->required_date = $request->required_date;
			$data->vendor_invoice_no = $request->vendor_invoice_no;
			$data->supplier_id = $request->supplier_id;
			$data->buyer_id = $request->buyer_id;
			$data->ship_via = $request->ship_via;
			$data->ship_to = $request->ship_to;
			$data->department = $request->department;

			$data->payment_id = $request->payment_id;
			$data->remarks = $request->remarks;
			$data->total_quantity = $request->total_quantity;
			$data->total_amount = $request->total_amount;
			$data->freight = $request->freight;
			$data->net_amount = $request->net_amount;
			$data->updated_at = Carbon::now();
			$data->updated_by = $request->login_user_id;
			$data->update();

			// Ledger::where('document_id', $id)->delete();

			// Ledger::create([
			// 	'ledger_id' => $this->get_uuid(),
			// 	'company_id' => $request->company_id,
			// 	'company_branch_id' => $request->company_branch_id,
			// 	'document_type_id' => $this->document_type_id,
			// 	'document_id' => $id,
			// 	'document_detail_id' => "",
			// 	'document_identity' => $request->document_identity ?? "",
			// 	'document_date' => $request->document_date ?? "",
			// 	'sort_order' => 0,
			// 	'partner_type' => 'Vendor',
			// 	'partner_id' => $request->supplier_id,
			// 	'ref_document_type_id' => $purchaseOrder->document_type_id,
			// 	'ref_document_identity' => $purchaseOrder->document_identity,
			// 	'account_id' => $outstanding_account_id ?? null,
			// 	'remarks' => '',
			// 	'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
			// 	'document_debit' => $request->net_amount ?? "",
			// 	'document_credit' => 0,
			// 	'base_currency_id' => $base_currency_id,
			// 	'conversion_rate' => $conversion_rate,
			// 	'debit' => ($request->net_amount ?? 0) * $conversion_rate,
			// 	'credit' => 0,
			// 	'document_amount' => $request->net_amount ?? "",
			// 	'amount' => ($request->net_amount ?? 0) * $conversion_rate,
			// 	'created_at' => Carbon::now(),
			// 	'created_by_id' => $request->login_user_id,
			// ]);
			// if ((float)$purchaseOrder->freight > 0) {
			// 	Ledger::create([
			// 		'ledger_id' => $this->get_uuid(),
			// 		'company_id' => $request->company_id,
			// 		'company_branch_id' => $request->company_branch_id,
			// 		'document_type_id' => $this->document_type_id,
			// 		'document_id' => $id,
			// 		'document_detail_id' => "",
			// 		'document_identity' => $request->document_identity ?? "",
			// 		'document_date' => $request->document_date ?? "",
			// 		'sort_order' => 1,
			// 		'partner_type' => '',
			// 		'partner_id' => '',
			// 		'ref_document_type_id' => $purchaseOrder->document_type_id,
			// 		'ref_document_identity' => $purchaseOrder->document_identity,
			// 		'account_id' => $freight_account_id ?? null,
			// 		'remarks' => '',
			// 		'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
			// 		'document_debit' => $purchaseOrder->freight ?? "",
			// 		'document_credit' => 0,
			// 		'base_currency_id' => $base_currency_id,
			// 		'conversion_rate' => $conversion_rate,
			// 		'debit' => ($request->freight ?? 0) * $conversion_rate,
			// 		'credit' => 0,
			// 		'document_amount' => $request->freight ?? "",
			// 		'amount' => ($request->freight ?? 0) * $conversion_rate,
			// 		'created_at' => Carbon::now(),
			// 		'created_by_id' => $request->login_user_id,
			// 	]);
			// }

			if ($request->purchase_invoice_detail) {

				foreach ($request->purchase_invoice_detail as $key => $value) {
					$detail_uuid = null;
					if ($value['row_status'] == 'I') {
						$detail_uuid = $this->get_uuid();

						$insertArr = [
							'purchase_invoice_id' => $id,
							'purchase_invoice_detail_id' => $detail_uuid,
							'charge_order_detail_id' => $value->charge_order_detail_id ?? "",
							'sort_order' => $value['sort_order'] ?? "",
							'product_id' => $value['product_id'] ?? "",
							'product_name' => $value['product_name'] ?? "",
							'product_description' => $value['product_description'] ?? "",
							'description' => $value['description'] ?? "",
							'vpart' => $value['vpart'] ?? "",
							'unit_id' => $value['unit_id'] ?? "",
							'po_price' => $value['po_price'] ?? "",
							'quantity' => $value['quantity'] ?? "",
							'rate' => $value['rate'] ?? "",
							'amount' => $value['amount'] ?? "",
							'vendor_notes' => $value['vendor_notes'] ?? "",
							'created_at' => Carbon::now(),
							'created_by' => $request->login_user_id,
						];
						PurchaseInvoiceDetail::create($insertArr);
					}
					if ($value['row_status'] == 'U') {
						$UpdateArr = [
							'sort_order' => $value['sort_order'] ?? "",
							'product_id' => $value['product_id'] ?? "",
							'product_name' => $value['product_name'] ?? "",
							'product_description' => $value['product_description'] ?? "",
							'description' => $value['description'] ?? "",
							'vpart' => $value['vpart'] ?? "",
							'unit_id' => $value['unit_id'] ?? "",
							'po_price' => $value['po_price'] ?? "",
							'quantity' => $value['quantity'] ?? "",
							'rate' => $value['rate'] ?? "",
							'amount' => $value['amount'] ?? "",
							'vendor_notes' => $value['vendor_notes'] ?? "",
							'updated_at' => Carbon::now(),
							'updated_by' => $request->login_user_id,
						];
						PurchaseInvoiceDetail::where('purchase_invoice_detail_id', $value['purchase_invoice_detail_id'])->update($UpdateArr);
					}
					if ($value['row_status'] == 'D') {
						PurchaseInvoiceDetail::where('purchase_invoice_detail_id', $value['purchase_invoice_detail_id'])->delete();
					}

					// if ($value['row_status'] != 'D') {
					// 	$product = Product::where('product_id', $value['product_id'])->first();
					// 	$inventory_account_id = $product->inventory_account_id;
					// 	Ledger::create([
					// 		'ledger_id' => $this->get_uuid(),
					// 		'company_id' => $request->company_id,
					// 		'company_branch_id' => $request->company_branch_id,
					// 		'document_type_id' => $this->document_type_id,
					// 		'document_id' => $id,
					// 		'document_detail_id' => $value['purchase_invoice_detail_id'] ?? $detail_uuid,
					// 		'document_identity' => $request->document_identity ?? "",
					// 		'document_date' => $request->document_date ?? "",
					// 		'sort_order' => $value['sort_order'] + 2,
					// 		'partner_type' => '',
					// 		'partner_id' => '',
					// 		'ref_document_type_id' => $purchaseOrder->document_type_id,
					// 		'ref_document_identity' => $purchaseOrder->document_identity,
					// 		'account_id' => $inventory_account_id ?? null,
					// 		'remarks' => '',
					// 		'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
					// 		'document_debit' => $value['amount'] ?? "",
					// 		'document_credit' => 0,
					// 		'base_currency_id' => $base_currency_id,
					// 		'conversion_rate' => $conversion_rate,
					// 		'debit' => ($value['amount'] ?? 0) * $conversion_rate,
					// 		'credit' => 0,
					// 		'document_amount' => $value['amount'] ?? "",
					// 		'amount' => ($value['amount'] ?? 0) * $conversion_rate,
					// 		'created_at' => Carbon::now(),
					// 		'created_by_id' => $request->login_user_id,
					// 	]);
					// }
				}
			}
			DB::commit();

			return $this->jsonResponse(['purchase_invoice_id' => $id], 200, "Update Purchase Invoice Successfully!");
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Purchase Invoice Updated Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while updating Purchase Invoice.", 500, "Transaction Failed");
		}
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'purchase_invoice', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = PurchaseInvoice::where('purchase_invoice_id', $id)->first();
		if (!$data) return $this->jsonResponse(['purchase_invoice_id' => $id], 404, "Purchase Invoice Not Found!");
		$data->delete();
		Ledger::where('document_id', $id)->delete();
		PurchaseInvoiceDetail::where('purchase_invoice_id', $id)->delete();
		return $this->jsonResponse(['purchase_invoice_id' => $id], 200, "Delete Purchase Invoice Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'purchase_invoice', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->purchase_invoice_ids) && !empty($request->purchase_invoice_ids) && is_array($request->purchase_invoice_ids)) {
				foreach ($request->purchase_invoice_ids as $purchase_invoice_id) {
					$user = PurchaseInvoice::where(['purchase_invoice_id' => $purchase_invoice_id])->first();
					$user->delete();
					Ledger::where('document_id', $purchase_invoice_id)->delete();
					PurchaseInvoiceDetail::where('purchase_invoice_id', $purchase_invoice_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Purchase Invoice successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
