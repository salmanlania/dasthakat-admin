<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\CustomerPaymentSettlement;
use App\Models\CustomerPaymentSettlementDetail;
use App\Models\Ledger;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CustomerPaymentSettlementController extends Controller
{
    protected $document_type_id = 61;
    protected $db;

    public function index(Request $request)
    {
        $document_identity = $request->input('document_identity', '');
        $document_date = $request->input('document_date', '');
        $customer_id = $request->input('customer_id', '');
        $customer_payment_no = $request->input('customer_payment_no', '');
        $transaction_account_id = $request->input('transaction_account_id', '');
        $transaction_no = $request->input('transaction_no', '');
        $remarks = $request->input('remarks', '');
        $total_amount = $request->input('total_amount', '');
        $bank_amount = $request->input('bank_amount', '');
        $net_amount = $request->input('net_amount', '');
        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'customer_payment_settlement.created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $data = CustomerPaymentSettlement::LeftJoin('customer as c', 'c.customer_id', '=', 'customer_payment_settlement.customer_id')
        ->leftJoin('customer_payment as cp', 'cp.customer_payment_id', '=', 'customer_payment_settlement.customer_payment_id')
            ->LeftJoin('accounts as a', 'a.account_id', '=', 'customer_payment_settlement.transaction_account_id');

        $data = $data->where('customer_payment_settlement.company_id', '=', $request->company_id);
        $data = $data->where('customer_payment_settlement.company_branch_id', '=', $request->company_branch_id);

        if (!empty($document_identity)) $data->where('customer_payment_settlement.document_identity', 'like', "%$document_identity%");
        if (!empty($transaction_no)) $data->where('customer_payment_settlement.transaction_no', 'like', "%$transaction_no%");
        if (!empty($customer_payment_no)) $data->where('cp.document_identity', 'like', "%$customer_payment_no%");
        if (!empty($total_amount)) $data->where('customer_payment_settlement.total_amount', 'like', "%$total_amount%");
        if (!empty($bank_amount)) $data->where('customer_payment_settlement.bank_amount', 'like', "%$bank_amount%");
        if (!empty($net_amount)) {
            $data->whereRaw('(customer_payment_settlement.total_amount - customer_payment_settlement.bank_amount) like ?', ["%$net_amount%"]);
        }
        if (!empty($remarks)) $data->where('customer_payment_settlement.remarks', 'like', "%$remarks%");
        if (!empty($document_date)) $data->where('customer_payment_settlement.document_date', $document_date);
        if (!empty($customer_id)) $data->where('c.customer_id', $customer_id);
        if (!empty($customer_payment_id)) $data->where('customer_payment_settlement.customer_payment_id', $customer_payment_id);
        if (!empty($transaction_account_id)) $data->where('a.account_id', $transaction_account_id);

        if (!empty($search)) {
            $search = strtolower($search);
            $data->where(function ($query) use ($search) {
                $query
                    ->where('c.name', 'like', "%$search%")
                    ->orWhere('customer_payment_settlement.document_identity', 'like', "%$search%")
                    ->orWhere('customer_payment_settlement.transaction_no', 'like', "%$search%")
                    ->orWhere('cp.document_identity', 'like', "%$search%")
                    ->orWhere('customer_payment_settlement.remarks', 'like', "%$search%")
                    ->orWhere('a.name', 'like', "%$search%");
            });
        }
        $data = $data->select(
            'customer_payment_settlement.*',
            DB::raw('(customer_payment_settlement.total_amount - customer_payment_settlement.bank_amount) as net_amount'),
            'c.name as customer_name',
            'a.name as transaction_account_name',
            'cp.document_identity as customer_payment_no'
        );

        $data = $data->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);


        return response()->json($data);
    }


    public function show($id, Request $request)
    {

        $data = CustomerPaymentSettlement::with('details', 'customer', 'transaction_account', 'document_currency', 'base_currency', 'customer_payment', 'details.account')
            ->where('customer_payment_settlement_id', $id)
            ->first();

        if (!$data) {
            return $this->jsonResponse(null, 404, "Customer Payment Settlement not found");
        }

        return $this->jsonResponse($data, 200, "Customer Payment Settlement Data");
    }


    public function validateRequest($request, $id = null)
    {
        $rules = [
            'document_date' => 'required|date',
            'customer_id' => 'required|string|size:36',
            'total_amount' => 'required|numeric|min:0',
            'details' => 'required|array|min:1',
            // 'details.*.customer_payment_id' => 'required|string|size:36',
            'details.*.amount' => 'required|numeric|min:0',
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
        if (!isPermission('add', 'customer_payment_settlement', $request->permission_list))
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
            // $undeposited_account_id = Setting::getValue('gl_accounts_setting', 'undeposited_account', true)[0] ?? "";
            if (empty($outstanding_account_id)) return $this->jsonResponse(null, 400, "Customer Outstanding Account not found");
            // if (empty($undeposited_account_id)) return $this->jsonResponse(null, 400, "Undeposited Transaction Account not found");
            $default_currency_id = Currency::where('company_id', $request->company_id)
                ->where('company_branch_id', $request->company_branch_id)
                ->value('currency_id');
            $conversion_rate = 1;

            $data = [
                'company_id' => $request->company_id ?? "",
                'company_branch_id' => $request->company_branch_id ?? "",
                'customer_payment_settlement_id' => $uuid,
                'document_type_id' => $document['document_type_id'] ?? "",
                'document_no' => $document['document_no'] ?? "",
                'document_prefix' => $document['document_prefix'] ?? "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date ?? "",
                'customer_id' => $request->customer_id ?? "",
                'base_currency_id' => $base_currency_id ?? "",
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'transaction_account_id' => $request->transaction_account_id ?? null,
                'customer_payment_id' => $request->customer_payment_id ?? null,
                'transaction_no' => $request->transaction_no ?? null,
                'conversion_rate' => $conversion_rate,
                'total_amount' => $request->total_amount ?? "",
                'bank_amount' => $request->bank_amount ?? "",
                'remarks' => $request->remarks ?? "",
                'created_at' => Carbon::now(),
                'created_by' => $request->login_user_id,
            ];
            CustomerPaymentSettlement::create($data);

            Ledger::create([
                'ledger_id' => $this->get_uuid(),
                'company_id' => $request->company_id,
                'company_branch_id' => $request->company_branch_id,
                'document_type_id' => $this->document_type_id,
                'document_id' => $uuid,
                'document_detail_id' => "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date ?? "",
                'sort_order' => 0,
                'partner_type' => '',
                'partner_id' => '',
                'ref_document_type_id' => "",
                'ref_document_identity' => "",
                'account_id' => $request->customer_payment_account_id ?? null,
                'remarks' => '',
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'document_debit' => 0,
                'document_credit' => $request->total_amount ?? "",
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'debit' => 0,
                'credit' => ($request->total_amount ?? 0) * $conversion_rate,
                'document_amount' => $request->total_amount ?? "",
                'amount' => ($request->total_amount ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
                'cheque_no' => $request->transaction_no ?? null,
            ]);
            Ledger::create([
                'ledger_id' => $this->get_uuid(),
                'company_id' => $request->company_id,
                'company_branch_id' => $request->company_branch_id,
                'document_type_id' => $this->document_type_id,
                'document_id' => $uuid,
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
                'document_credit' => 0,
                'document_debit' => $request->bank_amount ?? "",
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'credit' => 0,
                'debit' => ($request->bank_amount ?? 0) * $conversion_rate,
                'document_amount' => $request->bank_amount ?? "",
                'amount' => ($request->bank_amount ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
                'cheque_no' => $request->transaction_no ?? null,
            ]);

            if ($request->details) {
                foreach ($request->details as $key => $value) {
                    $detail_uuid = $this->get_uuid();
                    $data = [
                        'customer_payment_settlement_id' => $uuid,
                        'customer_payment_settlement_detail_id' => $detail_uuid,
                        'sort_order' => $value['sort_order'] ?? "",
                        'account_id' => $value['account_id'] ?? "",
                        'amount' => $value['amount'] ?? "",
                        'remarks' => $value['remarks'] ?? "",
                        'created_at' => Carbon::now(),
                        'created_by' => $request->login_user_id,
                    ];

                    CustomerPaymentSettlementDetail::create($data);

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
                        'ref_document_type_id' => "",
                        'ref_document_identity' => "",
                        'account_id' => $value['account_id'] ?? '',
                        'remarks' => '',
                        'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                        'document_debit' => $value['amount'] ?? "",
                        'document_credit' => 0,
                        'base_currency_id' => $base_currency_id,
                        'conversion_rate' => $conversion_rate,
                        'debit' => $value['amount'] * $conversion_rate ?? "",
                        'credit' => 0,
                        'document_amount' => $value['amount'] ?? "",
                        'amount' => $value['amount'] * $conversion_rate ?? "",
                        'created_at' => Carbon::now(),
                        'created_by_id' => $request->login_user_id,
                    ]);
                }
            }

            DB::commit();
            return $this->jsonResponse(['customer_payment_settlement_id' => $uuid], 200, "Add Customer Payment Settlement Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Customer Payment Settlement Store Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while saving customer payment settlement." . $e->getMessage(), 500, "Transaction Failed");
        }
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'customer_payment_settlement', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");


        // Validation Rules
        $isError = $this->validateRequest($request->all(), $id);
        if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

        $base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
        $default_currency_id = Currency::where('company_id', $request->company_id)
            ->where('company_branch_id', $request->company_branch_id)
            ->value('currency_id');
        $conversion_rate = 1;

        DB::beginTransaction();
        try {
            $data  = CustomerPaymentSettlement::where('customer_payment_settlement_id', $id)->first();
            $data->company_id = $request->company_id;
            $data->company_branch_id = $request->company_branch_id;
            $data->document_date = $request->document_date;
            $data->customer_id = $request->customer_id;
            $data->document_currency_id = $request->document_currency_id ?? $default_currency_id;
            $data->transaction_account_id = $request->transaction_account_id;
            $data->transaction_no = $request->transaction_no;
            $data->customer_payment_id = $request->customer_payment_id;
            $data->conversion_rate = $conversion_rate;
            $data->total_amount = $request->total_amount;
            $data->bank_amount = $request->bank_amount;
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
                'account_id' => $request->customer_payment_account_id,
                'remarks' => '',
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'document_debit' => 0,
                'document_credit' => $request->total_amount ?? "",
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'debit' => 0,
                'credit' => ($request->total_amount ?? 0) * $conversion_rate,
                'document_amount' => $request->total_amount ?? "",
                'amount' => ($request->total_amount ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
                'cheque_no' => $request->transaction_no ?? null,
            ]);
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
                'document_credit' => 0,
                'document_debit' => $request->bank_amount ?? "",
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'credit' => 0,
                'debit' => ($request->bank_amount ?? 0) * $conversion_rate,
                'document_amount' => $request->bank_amount ?? "",
                'amount' => ($request->bank_amount ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
                'cheque_no' => $request->transaction_no ?? null,
            ]);

            if ($request->details) {
                foreach ($request->details as $value) {
                    $detail_uuid = null;
                    if ($value['row_status'] == 'I') {
                        $detail_uuid = $this->get_uuid();
                        $insert = [
                            'customer_payment_settlement_id' => $id,
                            'customer_payment_settlement_detail_id' => $detail_uuid,
                            'sort_order' => $value['sort_order'] ?? 0,
                            'account_id' => $value['account_id'] ?? "",
                            'amount' => $value['amount'] ?? "",
                            'remarks' => $value['remarks'] ?? "",
                            'created_at' => Carbon::now(),
                            'created_by' => $request->login_user_id,
                        ];
                        CustomerPaymentSettlementDetail::create($insert);
                    }
                    if ($value['row_status'] == 'U') {
                        $update = [
                            'sort_order' => $value['sort_order'] ?? 0,
                            'account_id' => $value['account_id'] ?? "",
                            'amount' => $value['amount'] ?? "",
                            'remarks' => $value['remarks'] ?? "",
                            'updated_at' => Carbon::now(),
                            'updated_by' => $request->login_user_id,
                        ];
                        CustomerPaymentSettlementDetail::where('customer_payment_settlement_detail_id', $value['customer_payment_settlement_detail_id'])->update($update);
                    }
                    if ($value['row_status'] == 'D') {
                        CustomerPaymentSettlementDetail::where('customer_payment_settlement_detail_id', $value['customer_payment_settlement_detail_id'])->delete();
                    }

                    if ($value['row_status'] != 'D') {
                        Ledger::create([
                            'ledger_id' => $this->get_uuid(),
                            'company_id' => $request->company_id,
                            'company_branch_id' => $request->company_branch_id,
                            'document_type_id' => $this->document_type_id,
                            'document_id' => $id,
                            'document_detail_id' => $value['customer_payment_settlement_detail_id'] ?? $detail_uuid,
                            'document_identity' => $request->document_identity ?? "",
                            'document_date' => $request->document_date ?? "",
                            'sort_order' => $value['sort_order'] ?? "",
                            'partner_type' => 'Customer',
                            'partner_id' => $request->customer_id,
                            'ref_document_type_id' => "",
                            'ref_document_identity' => "",
                            'account_id' => $value['account_id'] ?? "",
                            'remarks' => '',
                            'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                            'document_debit' => $value['amount'] ?? "",
                            'document_credit' => 0,
                            'base_currency_id' => $base_currency_id,
                            'conversion_rate' => $conversion_rate,
                            'debit' => $value['amount'] * $conversion_rate ?? "",
                            'credit' => 0,
                            'document_amount' => $value['amount'] ?? "",
                            'amount' => $value['amount'] * $conversion_rate ?? "",
                            'created_at' => Carbon::now(),
                            'created_by_id' => $request->login_user_id,
                        ]);
                    }
                }
            }
            DB::commit();

            return $this->jsonResponse(['customer_payment_settlement_id' => $id], 200, "Update Customer Payment Settlement Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Customer Payment Settlement Updating Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while updating Customer Payment Settlement." . $e->getMessage(), 500, "Transaction Failed");
        }
    }
    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'customer_payment_settlement', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");
        $data  = CustomerPaymentSettlement::where('customer_payment_settlement_id', $id)->first();
        if ($data) {
            $data->delete();
            Ledger::where('document_id', $id)
                ->where('document_type_id', $this->document_type_id)
                ->delete();
            CustomerPaymentSettlementDetail::where('customer_payment_settlement_id', $id)->delete();
        }
        return $this->jsonResponse(['customer_payment_settlement_id' => $id], 200, "Delete Customer Payment Settlement Successfully!");
    }
    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'customer_payment_settlement', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        try {
            if (isset($request->id) && !empty($request->id) && is_array($request->id)) {
                foreach ($request->id as $customer_payment_settlement_id) {
                    $user = CustomerPaymentSettlement::where(['customer_payment_settlement_id' => $customer_payment_settlement_id])->first();
                    if ($user) {
                        $user->delete();
                        Ledger::where('document_id', $customer_payment_settlement_id)
                            ->where('document_type_id', $this->document_type_id)
                            ->delete();
                        CustomerPaymentSettlementDetail::where('customer_payment_settlement_id', $customer_payment_settlement_id)->delete();
                    }
                }
            }

            return $this->jsonResponse('Deleted', 200, "Delete Customer Payment Settlement successfully!");
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
