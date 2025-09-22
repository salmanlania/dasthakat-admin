<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Setting;
use App\Models\CustomerPayment;
use App\Models\CustomerPaymentDetail;
use App\Models\Ledger;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CustomerPaymentController extends Controller
{
    protected $document_type_id = 58;
    protected $db;

    public function index(Request $request)
    {
        $document_identity = $request->input('document_identity', '');
        $document_date = $request->input('document_date', '');
        $customer_id = $request->input('customer_id', '');
        $transaction_account_id = $request->input('transaction_account_id', '');

        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'customer_payment.created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $data = CustomerPayment::LeftJoin('customer as c', 'c.customer_id', '=', 'customer_payment.customer_id')
            ->LeftJoin('accounts as a', 'a.account_id', '=', 'customer_payment.transaction_account_id');

        $data = $data->where('customer_payment.company_id', '=', $request->company_id);
        $data = $data->where('customer_payment.company_branch_id', '=', $request->company_branch_id);

        if (!empty($document_identity)) $data->where('customer_payment.document_identity', 'like', "%$document_identity%");
        if (!empty($document_date)) $data->where('customer_payment.document_date', $document_date);
        if (!empty($customer_id)) $data->where('c.customer_id', $customer_id);
        if (!empty($transaction_account_id)) $data->where('a.account_id', $transaction_account_id);

        if (!empty($search)) {
            $search = strtolower($search);
            $data->where(function ($query) use ($search) {
                $query
                    ->where('c.name', 'like', "%$search%")
                    ->orWhere('customer_payment.document_identity', 'like', "%$search%")
                    ->orWhere('a.name', 'like', "%$search%");
            });
        }
        $data = $data->select(
            'customer_payment.*',
            'c.name as customer_name',
            'a.name as transaction_account_name'
        );

        $data = $data->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);


        return response()->json($data);
    }


    public function show($id, Request $request)
    {

        $data = CustomerPayment::with('details', 'customer', 'transaction_account', 'document_currency', 'base_currency', 'details.sale_invoice')
            ->LeftJoin('customer as c', 'c.customer_id', '=', 'customer_payment.customer_id')
            ->LeftJoin('accounts as a', 'a.account_id', '=', 'customer_payment.transaction_account_id')
            ->where('customer_payment.customer_payment_id', $id)
            ->first();

        if (!$data) {
            return $this->jsonResponse(null, 404, "Customer Payment not found");
        }

        return $this->jsonResponse($data, 200, "Customer Payment Data");
    }


    public function validateRequest($request, $id = null)
    {
        $rules = [
            'document_date' => 'required|date',
            'customer_id' => 'required|string|size:36',
            'details' => 'required|array|min:1',
            'details.*.sale_invoice_id' => 'required|string|size:36',
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

        if (!isPermission('add', 'customer_payment', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        // Validation Rules
        $isError = $this->validateRequest($request->all());
        if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


        DB::beginTransaction();
        try {

            $uuid = $this->get_uuid();
            $document = DocumentType::getNextDocument($this->document_type_id, $request);
            $base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
            $outstanding_account_id = Customer::where('customer_id', $request->customer_id)->pluck('outstanding_account_id')->first();
            $default_currency_id = Currency::where('company_id', $request->company_id)
                ->where('company_branch_id', $request->company_branch_id)
                ->value('currency_id');
            $conversion_rate = 1;
            $data = [
                'company_id' => $request->company_id ?? "",
                'company_branch_id' => $request->company_branch_id ?? "",
                'customer_payment_id' => $uuid,
                'document_type_id' => $document['document_type_id'] ?? "",
                'document_no' => $document['document_no'] ?? "",
                'document_prefix' => $document['document_prefix'] ?? "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date ?? "",
                'customer_id' => $request->customer_id ?? "",
                'base_currency_id' => $base_currency_id ?? "",
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'transaction_account_id' => json_decode(Setting::getValue('gl_account_setting', 'undeposited_account'))[0],
                'conversion_rate' => $conversion_rate,
                'payment_amount' => $request->payment_amount ?? "",
                'total_amount' => $request->total_amount ?? "",
                'remarks' => $request->remarks ?? "",
                'created_at' => Carbon::now(),
                'created_by' => $request->login_user_id,
            ];
            CustomerPayment::create($data);

            Ledger::create([
                'ledger_id' => $this->get_uuid(),
                'company_id' => $request->company_id,
                'company_branch_id' => $request->company_branch_id,
                'document_type_id' => $this->document_type_id,
                'document_id' => $uuid ?? "",
                'document_detail_id' => "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date ?? "",
                'sort_order' => "",
                'partner_type' => 'Customer',
                'partner_id' => $request->customer_id,
                'ref_document_type_id' => "",
                'ref_document_identity' => "",
                'account_id' => $outstanding_account_id,
                'remarks' => '',
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'document_debit' => $request->payment_amount ?? "",
                'document_credit' => 0,
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'debit' => ($request->payment_amount ?? 0) * $conversion_rate,
                'credit' => 0,
                'document_amount' => $request->payment_amount ?? "",
                'amount' => ($value['settled_amount'] ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
            ]);

            if ($request->details) {
                foreach ($request->details as $key => $value) {
                    $detail_uuid = $this->get_uuid();
                    $data = [
                        'customer_payment_id' => $uuid,
                        'customer_payment_detail_id' => $detail_uuid,
                        'sort_order' => $value['sort_order'] ?? "",
                        'sale_invoice_id' => $value['sale_invoice_id'] ?? "",
                        'ref_document_identity' => $value['ref_document_identity'] ?? "",
                        'original_amount' => $value['original_amount'] ?? "",
                        'balance_amount' => $value['balance_amount'] ?? "",
                        'settled_amount' => $value['settled_amount'] ?? "",
                        'account_id' => $outstanding_account_id,
                        'created_at' => Carbon::now(),
                        'created_by' => $request->login_user_id,
                    ];

                    CustomerPaymentDetail::create($data);

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
                        'partner_type' => 'Customer',
                        'partner_id' => $request->customer_id,
                        'ref_document_type_id' => $value['ref_document_type_id'] ?? "",
                        'ref_document_identity' => $value['ref_document_identity'] ?? "",
                        'account_id' => $outstanding_account_id,
                        'remarks' => '',
                        'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                        'document_debit' => 0,
                        'document_credit' => $value['settled_amount'] ?? "",
                        'base_currency_id' => $base_currency_id,
                        'conversion_rate' => $conversion_rate,
                        'debit' => 0,
                        'credit' => $value['settled_amount'] * $conversion_rate ?? "",
                        'document_amount' => $value['settled_amount'] ?? "",
                        'amount' => $value['settled_amount'] * $conversion_rate ?? "",
                        'created_at' => Carbon::now(),
                        'created_by_id' => $request->login_user_id,
                    ]);
                }
            }

            DB::commit();
            return $this->jsonResponse(['customer_payment_id' => $uuid], 200, "Add Customer Payment Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Customer Payment Store Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while saving customer payment." . $e->getMessage(), 500, "Transaction Failed");
        }
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'customer_payment', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");


        // Validation Rules
        $isError = $this->validateRequest($request->all(), $id);
        if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

        $base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
        $outstanding_account_id = Customer::where('customer_id', $request->customer_id)->pluck('outstanding_account_id')->first();
        $default_currency_id = Currency::where('company_id', $request->company_id)
            ->where('company_branch_id', $request->company_branch_id)
            ->value('currency_id');
        $conversion_rate = 1;

        DB::beginTransaction();
        try {
            $data  = CustomerPayment::where('customer_payment_id', $id)->first();
            $data->company_id = $request->company_id;
            $data->company_branch_id = $request->company_branch_id;
            $data->document_date = $request->document_date;
            $data->customer_id = $request->customer_id;
            $data->document_currency_id = $request->document_currency_id;
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
                'sort_order' => "",
                'partner_type' => 'Customer',
                'partner_id' => $request->customer_id,
                'ref_document_type_id' => "",
                'ref_document_identity' => "",
                'account_id' => $outstanding_account_id,
                'remarks' => '',
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'document_debit' => $request->payment_amount ?? "",
                'document_credit' => 0,
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'debit' => ($request->payment_amount ?? 0) * $conversion_rate,
                'credit' => 0,
                'document_amount' => $request->payment_amount ?? "",
                'amount' => ($value['settled_amount'] ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
            ]);

            if ($request->details) {
                foreach ($request->details as $value) {
                    $detail_uuid = null;
                    if ($value['row_status'] == 'I') {
                        $detail_uuid = $this->get_uuid();
                        $insert = [
                            'customer_payment_id' => $id,
                            'customer_payment_detail_id' => $detail_uuid,
                            'sort_order' => $value['sort_order'] ?? 0,
                            'sale_invoice_id' => $value['sale_invoice_id'] ?? "",
                            'ref_document_identity' => $value['ref_document_identity'] ?? "",
                            'original_amount' => $value['original_amount'] ?? "",
                            'balance_amount' => $value['balance_amount'] ?? "",
                            'settled_amount' => $value['settled_amount'] ?? "",
                            'account_id' => $outstanding_account_id,
                            'created_at' => Carbon::now(),
                            'created_by' => $request->login_user_id,
                        ];
                        CustomerPaymentDetail::create($insert);
                    }
                    if ($value['row_status'] == 'U') {
                        $update = [
                            'sort_order' => $value['sort_order'] ?? 0,
                            'sale_invoice_id' => $value['sale_invoice_id'] ?? "",
                            'ref_document_identity' => $value['ref_document_identity'] ?? "",
                            'original_amount' => $value['original_amount'] ?? "",
                            'balance_amount' => $value['balance_amount'] ?? "",
                            'settled_amount' => $value['settled_amount'] ?? "",
                            'account_id' => $outstanding_account_id,
                            'updated_at' => Carbon::now(),
                            'updated_by' => $request->login_user_id,
                        ];
                        CustomerPaymentDetail::where('customer_payment_detail_id', $value['customer_payment_detail_id'])->update($update);
                    }
                    if ($value['row_status'] == 'D') {
                        CustomerPaymentDetail::where('customer_payment_detail_id', $value['customer_payment_detail_id'])->delete();
                    }

                    if ($value['row_status'] != 'D') {
                        Ledger::create([
                            'ledger_id' => $this->get_uuid(),
                            'company_id' => $request->company_id,
                            'company_branch_id' => $request->company_branch_id,
                            'document_type_id' => $this->document_type_id,
                            'document_id' => $id,
                            'document_detail_id' => $value['customer_payment_detail_id'] ?? $detail_uuid,
                            'document_identity' => $document['document_identity'] ?? "",
                            'document_date' => $request->document_date ?? "",
                            'sort_order' => $value['sort_order'] ?? "",
                            'partner_type' => 'Customer',
                            'partner_id' => $request->customer_id,
                            'ref_document_type_id' => $value['ref_document_type_id'] ?? "",
                            'ref_document_identity' => $value['ref_document_identity'] ?? "",
                            'account_id' => $outstanding_account_id,
                            'remarks' => '',
                            'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                            'document_debit' => 0,
                            'document_credit' => $value['settled_amount'] ?? "",
                            'base_currency_id' => $base_currency_id,
                            'conversion_rate' => $conversion_rate,
                            'debit' => 0,
                            'credit' => $value['settled_amount'] * $conversion_rate ?? "",
                            'document_amount' => $value['settled_amount'] ?? "",
                            'amount' => $value['settled_amount'] * $conversion_rate ?? "",
                            'created_at' => Carbon::now(),
                            'created_by_id' => $request->login_user_id,
                        ]);
                    }
                }
            }
            DB::commit();

            return $this->jsonResponse(['customer_payment_id' => $id], 200, "Update Customer Payment Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Customer Payment Updating Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while updating Customer Payment." . $e->getMessage(), 500, "Transaction Failed");
        }
    }
    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'customer_payment', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");
        $data  = CustomerPayment::where('customer_payment_id', $id)->first();
        if ($data) {
            $data->delete();
            CustomerPaymentDetail::where('customer_payment_id', $id)->delete();
        }
        return $this->jsonResponse(['customer_payment_id' => $id], 200, "Delete Customer Payment Successfully!");
    }
    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'customer_payment', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        try {
            if (isset($request->id) && !empty($request->id) && is_array($request->id)) {
                foreach ($request->id as $customer_payment_id) {
                    $user = CustomerPayment::where(['customer_payment_id' => $customer_payment_id])->first();
                    if ($user) {
                        $user->delete();
                        CustomerPaymentDetail::where('customer_payment_id', $customer_payment_id)->delete();
                    }
                }
            }

            return $this->jsonResponse('Deleted', 200, "Delete Customer Payment successfully!");
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
