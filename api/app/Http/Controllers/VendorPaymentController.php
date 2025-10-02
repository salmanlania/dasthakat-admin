<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Setting;
use App\Models\VendorPayment;
use App\Models\VendorPaymentDetail;
use App\Models\Ledger;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VendorPaymentController extends Controller
{
    protected $document_type_id = 60;
    protected $db;

    public function index(Request $request)
    {
        $document_identity = $request->input('document_identity', '');
        $document_date = $request->input('document_date', '');
        $supplier_id = $request->input('supplier_id', '');
        $transaction_account_id = $request->input('transaction_account_id', '');
        $remarks = $request->input('remarks', '');
        $payment_amount = $request->input('payment_amount', '');
        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'vendor_payment.created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $data = VendorPayment::LeftJoin('supplier as c', 'c.supplier_id', '=', 'vendor_payment.supplier_id')
            ->LeftJoin('accounts as a', 'a.account_id', '=', 'vendor_payment.transaction_account_id');

        $data = $data->where('vendor_payment.company_id', '=', $request->company_id);
        $data = $data->where('vendor_payment.company_branch_id', '=', $request->company_branch_id);

        if (!empty($document_identity)) $data->where('vendor_payment.document_identity', 'like', "%$document_identity%");
        if (!empty($payment_amount)) $data->where('vendor_payment.payment_amount', 'like', "%$payment_amount%");
        if (!empty($remarks)) $data->where('vendor_payment.remarks', 'like', "%$remarks%");
        if (!empty($document_date)) $data->where('vendor_payment.document_date', $document_date);
        if (!empty($supplier_id)) $data->where('c.supplier_id', $supplier_id);
        if (!empty($transaction_account_id)) $data->where('a.account_id', $transaction_account_id);

        if (!empty($search)) {
            $search = strtolower($search);
            $data->where(function ($query) use ($search) {
                $query
                    ->where('c.name', 'like', "%$search%")
                    ->orWhere('vendor_payment.document_identity', 'like', "%$search%")
                    ->orWhere('vendor_payment.remarks', 'like', "%$search%")
                    ->orWhere('a.name', 'like', "%$search%");
            });
        }
        $data = $data->select(
            'vendor_payment.*',
            'c.name as supplier_name',
            'a.name as transaction_account_name'
        );

        $data = $data->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);


        return response()->json($data);
    }


    public function show($id, Request $request)
    {

        $data = VendorPayment::with('details', 'supplier', 'transaction_account', 'document_currency', 'base_currency', 'details.purchase_invoice','details.account')
            ->where('vendor_payment.vendor_payment_id', $id)
            ->first();

        if (!$data) {
            return $this->jsonResponse(null, 404, "Vendor Payment not found");
        }

        return $this->jsonResponse($data, 200, "Vendor Payment Data");
    }


    public function validateRequest($request, $id = null)
    {
        $rules = [
            'document_date' => 'required|date',
            'supplier_id' => 'required|string|size:36',
            'total_amount' => 'required|numeric|min:0',
            'payment_amount' => 'required|numeric|min:0',
            'details' => 'required|array|min:1',
            'details.*.purchase_invoice_id' => 'required|string|size:36',
            'details.*.settled_amount' => 'required|numeric|min:0',
        ];

        $validator = Validator::make($request, $rules);
        if ($validator->fails()) {
            $firstError = $validator->errors()->first();
            return  $firstError;
        }
        return [];
    }


    public function store(Request $request)
    {
        if (!isPermission('add', 'vendor_payment', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        // Validation Rules
        $isError = $this->validateRequest($request->all());
        if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


        DB::beginTransaction();
        try {

            $uuid = $this->get_uuid();
            $document = DocumentType::getNextDocument($this->document_type_id, $request);
            $base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
            $outstanding_account_id = Supplier::where('supplier_id', $request->supplier_id)->pluck('outstanding_account_id')->first();
            // $undeposited_account_id = Setting::getValue('gl_accounts_setting', 'undeposited_account', true)[0] ?? "";
            if (empty($outstanding_account_id)) return $this->jsonResponse(null, 400, "Vendor Outstanding Account not found");
            // if (empty($undeposited_account_id)) return $this->jsonResponse(null, 400, "Undeposited Transaction Account not found");
            $default_currency_id = Currency::where('company_id', $request->company_id)
                ->where('company_branch_id', $request->company_branch_id)
                ->value('currency_id');
            $conversion_rate = 1;

            $data = [
                'company_id' => $request->company_id ?? "",
                'company_branch_id' => $request->company_branch_id ?? "",
                'vendor_payment_id' => $uuid,
                'document_type_id' => $document['document_type_id'] ?? "",
                'document_no' => $document['document_no'] ?? "",
                'document_prefix' => $document['document_prefix'] ?? "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date ?? "",
                'supplier_id' => $request->supplier_id ?? "",
                'base_currency_id' => $base_currency_id ?? "",
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'transaction_account_id' => $request->transaction_account_id ?? null,
                'conversion_rate' => $conversion_rate,
                'payment_amount' => $request->payment_amount ?? "",
                'total_amount' => $request->total_amount ?? "",
                'remarks' => $request->remarks ?? "",
                'created_at' => Carbon::now(),
                'created_by' => $request->login_user_id,
            ];
            VendorPayment::create($data);

            Ledger::create([
                'ledger_id' => $this->get_uuid(),
                'company_id' => $request->company_id,
                'company_branch_id' => $request->company_branch_id,
                'document_type_id' => $this->document_type_id,
                'document_id' => $uuid ?? "",
                'document_detail_id' => "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date ?? "",
                'sort_order' => 0,
                'partner_type' => '',
                'partner_id' => '',
                'ref_document_type_id' => "",
                'ref_document_identity' => "",
                'account_id' => $request->transaction_account_id ?? null,
                'remarks' => '',
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'document_credit' => $request->payment_amount ?? "",
                'document_debit' => 0,
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'credit' => ($request->payment_amount ?? 0) * $conversion_rate,
                'debit' => 0,
                'document_amount' => $request->payment_amount ?? "",
                'amount' => ($request->payment_amount ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
            ]);

            if ($request->details) {
                foreach ($request->details as $key => $value) {
                    $detail_uuid = $this->get_uuid();
                    $data = [
                        'vendor_payment_id' => $uuid,
                        'vendor_payment_detail_id' => $detail_uuid,
                        'sort_order' => $value['sort_order'] ?? "",
                        'purchase_invoice_id' => $value['purchase_invoice_id'] ?? "",
                        'ref_document_identity' => $value['ref_document_identity'] ?? "",
                        'original_amount' => $value['original_amount'] ?? "",
                        'balance_amount' => $value['balance_amount'] ?? "",
                        'settled_amount' => $value['settled_amount'] ?? "",
                        'account_id' => $outstanding_account_id,
                        'created_at' => Carbon::now(),
                        'created_by' => $request->login_user_id,
                    ];

                    VendorPaymentDetail::create($data);

                    Ledger::create([
                        'ledger_id' => $this->get_uuid(),
                        'company_id' => $request->company_id,
                        'company_branch_id' => $request->company_branch_id,
                        'document_type_id' => $this->document_type_id,
                        'document_id' => $uuid,
                        'document_detail_id' => $detail_uuid,
                        'document_identity' => $document['document_identity'] ?? "",
                        'document_date' => $request->document_date ?? "",
                        'sort_order' => $value['sort_order'] ?? "",
                        'partner_type' => 'Vendor',
                        'partner_id' => $request->supplier_id,
                        'ref_document_type_id' => $value['ref_document_type_id'] ?? "",
                        'ref_document_identity' => $value['ref_document_identity'] ?? "",
                        'account_id' => $outstanding_account_id,
                        'remarks' => '',
                        'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                        'document_credit' => 0,
                        'document_debit' => $value['settled_amount'] ?? "",
                        'base_currency_id' => $base_currency_id,
                        'conversion_rate' => $conversion_rate,
                        'credit' => 0,
                        'debit' => $value['settled_amount'] * $conversion_rate ?? "",
                        'document_amount' => $value['settled_amount'] ?? "",
                        'amount' => $value['settled_amount'] * $conversion_rate ?? "",
                        'created_at' => Carbon::now(),
                        'created_by_id' => $request->login_user_id,
                    ]);
                }
            }

            DB::commit();
            return $this->jsonResponse(['vendor_payment_id' => $uuid], 200, "Add Vendor Payment Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Vendor Payment Store Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while saving vendor payment." . $e->getMessage(), 500, "Transaction Failed");
        }
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'vendor_payment', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");


        // Validation Rules
        $isError = $this->validateRequest($request->all(), $id);
        if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

        $base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
        // $undeposited_account_id = Setting::getValue('gl_accounts_setting', 'undeposited_account', true)[0] ?? "";
        // if (empty($undeposited_account_id)) return $this->jsonResponse(null, 400, "Undeposited Transaction Account not found");
        
        $outstanding_account_id = Supplier::where('supplier_id', $request->supplier_id)->pluck('outstanding_account_id')->first();
        if (empty($outstanding_account_id)) return $this->jsonResponse(null, 400, "Vendor Outstanding Account not found");

        $default_currency_id = Currency::where('company_id', $request->company_id)
            ->where('company_branch_id', $request->company_branch_id)
            ->value('currency_id');
        $conversion_rate = 1;

        DB::beginTransaction();
        try {
            $data  = VendorPayment::where('vendor_payment_id', $id)->first();
            $data->company_id = $request->company_id;
            $data->company_branch_id = $request->company_branch_id;
            $data->document_date = $request->document_date;
            $data->supplier_id = $request->supplier_id;
            $data->document_currency_id = $request->document_currency_id;
            $data->transaction_account_id = $request->transaction_account_id;
            $data->conversion_rate = $conversion_rate;
            $data->payment_amount = $request->payment_amount;
            $data->total_amount = $request->total_amount;
            $data->remarks = $request->remarks;
            $data->updated_at = Carbon::now();
            $data->updated_by = $request->login_user_id;
            $data->save();
            Ledger::where('document_id', $id)
                ->where('document_type_id', $this->document_type_id)
                ->delete();
            Ledger::create([
                'ledger_id' => $this->get_uuid(),
                'company_id' => $request->company_id,
                'company_branch_id' => $request->company_branch_id,
                'document_type_id' => $this->document_type_id,
                'document_id' => $id,
                'document_detail_id' => "",
                'document_identity' => $request->document_identity ?? "",
                'document_date' => $request->document_date ?? "",
                'sort_order' => 0,
                'partner_type' => '',
                'partner_id' => '',
                'ref_document_type_id' => "",
                'ref_document_identity' => "",
                'account_id' => $request->transaction_account_id,
                'remarks' => '',
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'document_credit' => $request->payment_amount ?? "",
                'document_debit' => 0,
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'credit' => ($request->payment_amount ?? 0) * $conversion_rate,
                'debit' => 0,
                'document_amount' => $request->payment_amount ?? "",
                'amount' => ($request->payment_amount ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
            ]);

            if ($request->details) {
                foreach ($request->details as $value) {
                    $detail_uuid = null;
                    if ($value['row_status'] == 'I') {
                        $detail_uuid = $this->get_uuid();
                        $insert = [
                            'vendor_payment_id' => $id,
                            'vendor_payment_detail_id' => $detail_uuid,
                            'sort_order' => $value['sort_order'] ?? 0,
                            'purchase_invoice_id' => $value['purchase_invoice_id'] ?? "",
                            'ref_document_identity' => $value['ref_document_identity'] ?? "",
                            'original_amount' => $value['original_amount'] ?? "",
                            'balance_amount' => $value['balance_amount'] ?? "",
                            'settled_amount' => $value['settled_amount'] ?? "",
                            'account_id' => $outstanding_account_id,
                            'created_at' => Carbon::now(),
                            'created_by' => $request->login_user_id,
                        ];
                        VendorPaymentDetail::create($insert);
                    }
                    if ($value['row_status'] == 'U') {
                        $update = [
                            'sort_order' => $value['sort_order'] ?? 0,
                            'purchase_invoice_id' => $value['purchase_invoice_id'] ?? "",
                            'ref_document_identity' => $value['ref_document_identity'] ?? "",
                            'original_amount' => $value['original_amount'] ?? "",
                            'balance_amount' => $value['balance_amount'] ?? "",
                            'settled_amount' => $value['settled_amount'] ?? "",
                            'account_id' => $outstanding_account_id,
                            'updated_at' => Carbon::now(),
                            'updated_by' => $request->login_user_id,
                        ];
                        VendorPaymentDetail::where('vendor_payment_detail_id', $value['vendor_payment_detail_id'])->update($update);
                    }
                    if ($value['row_status'] == 'D') {
                        VendorPaymentDetail::where('vendor_payment_detail_id', $value['vendor_payment_detail_id'])->delete();
                    }

                    if ($value['row_status'] != 'D') {
                        Ledger::create([
                            'ledger_id' => $this->get_uuid(),
                            'company_id' => $request->company_id,
                            'company_branch_id' => $request->company_branch_id,
                            'document_type_id' => $this->document_type_id,
                            'document_id' => $id,
                            'document_detail_id' => $value['vendor_payment_detail_id'] ?? $detail_uuid,
                            'document_identity' => $request->document_identity ?? "",
                            'document_date' => $request->document_date ?? "",
                            'sort_order' => $value['sort_order'] ?? "",
                            'partner_type' => 'Vendor',
                            'partner_id' => $request->supplier_id,
                            'ref_document_type_id' => $value['ref_document_type_id'] ?? "",
                            'ref_document_identity' => $value['ref_document_identity'] ?? "",
                            'account_id' => $outstanding_account_id,
                            'remarks' => '',
                            'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                            'document_credit' => 0,
                            'document_debit' => $value['settled_amount'] ?? "",
                            'base_currency_id' => $base_currency_id,
                            'conversion_rate' => $conversion_rate,
                            'credit' => 0,
                            'debit' => $value['settled_amount'] * $conversion_rate ?? "",
                            'document_amount' => $value['settled_amount'] ?? "",
                            'amount' => $value['settled_amount'] * $conversion_rate ?? "",
                            'created_at' => Carbon::now(),
                            'created_by_id' => $request->login_user_id,
                        ]);
                    }
                }
            }
            DB::commit();

            return $this->jsonResponse(['vendor_payment_id' => $id], 200, "Update Vendor Payment Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Vendor Payment Updating Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while updating Vendor Payment." . $e->getMessage(), 500, "Transaction Failed");
        }
    }
    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'vendor_payment', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");
        $data  = VendorPayment::where('vendor_payment_id', $id)->first();
        if ($data) {
            $data->delete();
            Ledger::where('document_id', $id)
                ->where('document_type_id', $this->document_type_id)
                ->delete();
            VendorPaymentDetail::where('vendor_payment_id', $id)->delete();
        }
        return $this->jsonResponse(['vendor_payment_id' => $id], 200, "Delete Vendor Payment Successfully!");
    }
    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'vendor_payment', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        try {
            if (isset($request->id) && !empty($request->id) && is_array($request->id)) {
                foreach ($request->id as $vendor_payment_id) {
                    $user = VendorPayment::where(['vendor_payment_id' => $vendor_payment_id])->first();
                    if ($user) {
                        $user->delete();
                        Ledger::where('document_id', $vendor_payment_id)
                            ->where('document_type_id', $this->document_type_id)
                            ->delete();
                        VendorPaymentDetail::where('vendor_payment_id', $vendor_payment_id)->delete();
                    }
                }
            }

            return $this->jsonResponse('Deleted', 200, "Delete Vendor Payment successfully!");
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
