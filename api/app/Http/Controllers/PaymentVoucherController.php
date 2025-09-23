<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\PaymentVoucher;
use App\Models\PaymentVoucherDetail;
use App\Models\Ledger;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentVoucherController extends Controller
{
    protected $document_type_id = 59;
    protected $db;

    public function index(Request $request)
    {
        $document_identity = $request->input('document_identity', '');
        $document_date = $request->input('document_date', '');
        $transaction_account_id = $request->input('transaction_account_id', '');
        $remarks = $request->input('remarks', '');
        $total_amount = $request->input('total_amount', '');

        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'payment_voucher.created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $data = PaymentVoucher::LeftJoin('accounts as a', 'a.account_id', '=', 'payment_voucher.transaction_account_id');

        $data = $data->where('payment_voucher.company_id', '=', $request->company_id);
        $data = $data->where('payment_voucher.company_branch_id', '=', $request->company_branch_id);

        if (!empty($document_identity)) $data->where('payment_voucher.document_identity', 'like', "%$document_identity%");
        if (!empty($remarks)) $data->where('payment_voucher.remarks', 'like', "%$remarks%");
        if (!empty($total_amount)) $data->where('payment_voucher.total_amount', 'like', "%$total_amount%");
        if (!empty($document_date)) $data->where('payment_voucher.document_date', $document_date);
        if (!empty($transaction_account_id)) $data->where('a.account_id', $transaction_account_id);

        if (!empty($search)) {
            $search = strtolower($search);
            $data->where(function ($query) use ($search) {
                $query
                    ->orWhere('payment_voucher.document_identity', 'like', "%$search%")
                    ->orWhere('payment_voucher.remarks', 'like', "%$search%")

                    ->orWhere('a.name', 'like', "%$search%");
            });
        }
        $data = $data->select(
            'payment_voucher.*',
            'a.name as transaction_account_name'
        );

        $data = $data->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);


        return response()->json($data);
    }


    public function show($id, Request $request)
    {

        $data = PaymentVoucher::with('details', 'details.account', 'transaction_account', 'document_currency', 'base_currency')
            ->where('payment_voucher.payment_voucher_id', $id)
            ->first();

        if (!$data) {
            return $this->jsonResponse(null, 404, "Payment Voucher not found");
        }

        return $this->jsonResponse($data, 200, "Payment Voucher Data");
    }


    public function validateRequest($request, $id = null)
    {
        $rules = [
            'document_date' => 'required|date',
            'total_amount' => 'required|numeric|min:0',
            // 'net_amount' => 'required|numeric|min:0',
            'details' => 'required|array|min:1',
            'details.*.payment_amount' => 'required|numeric|min:0',
            // 'details.*.net_amount' => 'required|numeric|min:0',
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
        if (!isPermission('add', 'payment_voucher', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        // Validation Rules
        $isError = $this->validateRequest($request->all());
        if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


        DB::beginTransaction();
        try {

            $uuid = $this->get_uuid();
            $document = DocumentType::getNextDocument($this->document_type_id, $request);
            $base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
            $default_currency_id = Currency::where('company_id', $request->company_id)
                ->where('company_branch_id', $request->company_branch_id)
                ->value('currency_id');
            $conversion_rate = 1;

            $data = [
                'company_id' => $request->company_id ?? "",
                'company_branch_id' => $request->company_branch_id ?? "",
                'payment_voucher_id' => $uuid,
                'document_type_id' => $document['document_type_id'] ?? "",
                'document_no' => $document['document_no'] ?? "",
                'document_prefix' => $document['document_prefix'] ?? "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date ?? "",
                'base_currency_id' => $base_currency_id ?? "",
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'transaction_account_id' => $request->transaction_account_id ?? null,
                'conversion_rate' => $conversion_rate,
                'total_amount' => $request->total_amount ?? "",
                // 'net_amount' => $request->net_amount ?? "",
                'remarks' => $request->remarks ?? "",
                'created_at' => Carbon::now(),
                'created_by' => $request->login_user_id,
            ];
            PaymentVoucher::create($data);

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
                'account_id' => $request->transaction_account_id ?? "",
                'remarks' => '',
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'document_debit' => $request->total_amount ?? "",
                'document_credit' => 0,
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'debit' => ($request->total_amount ?? 0) * $conversion_rate,
                'credit' => 0,
                'document_amount' => $request->total_amount ?? "",
                'amount' => ($request->total_amount ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
            ]);

            if ($request->details) {
                foreach ($request->details as $key => $value) {
                    $detail_uuid = $this->get_uuid();
                    $data = [
                        'payment_voucher_id' => $uuid,
                        'payment_voucher_detail_id' => $detail_uuid,
                        'sort_order' => $value['sort_order'] ?? "",
                        'account_id' => $value['account_id'] ?? "",
                        'cheque_no' => $value['cheque_no'] ?? "",
                        'cheque_date' => $value['cheque_date'] ?? "",
                        // 'document_amount' => $value['document_amount'] ?? "",
                        'payment_amount' => $value['payment_amount'] ?? "",
                        // 'tax_amount' => $value['tax_amount'] ?? "",
                        // 'tax_percent' => $value['tax_percent'] ?? "",
                        // 'net_amount' => $value['net_amount'] ?? "",
                        'created_at' => Carbon::now(),
                        'created_by' => $request->login_user_id,
                    ];

                    PaymentVoucherDetail::create($data);

                    if ((float)$value['payment_amount'] > 0)
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
                            'partner_type' => '',
                            'partner_id' => '',
                            'ref_document_type_id' => "",
                            'ref_document_identity' => "",
                            'account_id' => $value['account_id'] ?? "",
                            'remarks' => '',
                            'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                            'document_debit' => 0,
                            'document_credit' => $request->payment_amount ?? "",
                            'base_currency_id' => $base_currency_id,
                            'conversion_rate' => $conversion_rate,
                            'debit' => 0,
                            'credit' => ($request->payment_amount ?? 0) * $conversion_rate,
                            'document_amount' => $request->payment_amount ?? "",
                            'amount' => ($request->payment_amount ?? 0) * $conversion_rate,
                            'created_at' => Carbon::now(),
                            'created_by_id' => $request->login_user_id,
                            'cheque_no' => $value['cheque_no'] ?? "",
                            'cheque_date' => $value['cheque_date'] ?? "",
                        ]);

                    // if ((float)$value['tax_amount'] > 0)
                    //     Ledger::create([
                    //         'ledger_id' => $this->get_uuid(),
                    //         'company_id' => $request->company_id,
                    //         'company_branch_id' => $request->company_branch_id,
                    //         'document_type_id' => $this->document_type_id,
                    //         'document_id' => $uuid,
                    //         'document_detail_id' => $detail_uuid,
                    //         'document_identity' => $document['document_identity'] ?? "",
                    //         'document_date' => $request->document_date ?? "",
                    //         'sort_order' => $value['sort_order'] ?? "",
                    //         'partner_type' => '',
                    //         'partner_id' => '',
                    //         'ref_document_type_id' => "",
                    //         'ref_document_identity' => "",
                    //         'account_id' => $value['account_id'] ?? "",
                    //         'remarks' => '',
                    //         'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                    //         'document_debit' => 0,
                    //         'document_credit' => $request->tax_amount ?? "",
                    //         'base_currency_id' => $base_currency_id,
                    //         'conversion_rate' => $conversion_rate,
                    //         'debit' => 0,
                    //         'credit' => ($request->tax_amount ?? 0) * $conversion_rate,
                    //         'document_amount' => $request->tax_amount ?? "",
                    //         'amount' => ($request->tax_amount ?? 0) * $conversion_rate,
                    //         'created_at' => Carbon::now(),
                    //         'created_by_id' => $request->login_user_id,
                    //         'cheque_no' => $value['cheque_no'] ?? "",
                    //         'cheque_date' => $value['cheque_date'] ?? "",
                    //     ]);
                }
            }

            DB::commit();
            return $this->jsonResponse(['payment_voucher_id' => $uuid], 200, "Add Payment Voucher Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Payment Voucher Store Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while saving Payment Voucher." . $e->getMessage(), 500, "Transaction Failed");
        }
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'payment_voucher', $request->permission_list))
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
            $data  = PaymentVoucher::where('payment_voucher_id', $id)->first();
            $data->company_id = $request->company_id;
            $data->company_branch_id = $request->company_branch_id;
            $data->document_date = $request->document_date;
            $data->document_currency_id = $request->document_currency_id;
            $data->transaction_account_id = $request->transaction_account_id;
            $data->conversion_rate = $conversion_rate;
            $data->total_amount = $request->total_amount;
            // $data->net_amount = $request->net_amount;
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
                'account_id' => $request->transaction_account_id ?? "",
                'remarks' => '',
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'document_debit' => $request->total_amount ?? "",
                'document_credit' => 0,
                'base_currency_id' => $base_currency_id,
                'conversion_rate' => $conversion_rate,
                'debit' => ($request->total_amount ?? 0) * $conversion_rate,
                'credit' => 0,
                'document_amount' => $request->total_amount ?? "",
                'amount' => ($request->total_amount ?? 0) * $conversion_rate,
                'created_at' => Carbon::now(),
                'created_by_id' => $request->login_user_id,
            ]);


            if ($request->details) {
                foreach ($request->details as $value) {
                    $detail_uuid = null;
                    if ($value['row_status'] == 'I') {
                        $detail_uuid = $this->get_uuid();
                        $insert = [
                            'payment_voucher_id' => $id,
                            'payment_voucher_detail_id' => $detail_uuid,
                            'sort_order' => $value['sort_order'] ?? "",
                            'account_id' => $value['account_id'] ?? "",
                            'cheque_no' => $value['cheque_no'] ?? "",
                            'cheque_date' => $value['cheque_date'] ?? "",
                            // 'document_amount' => $value['document_amount'] ?? "",
                            'payment_amount' => $value['payment_amount'] ?? "",
                            // 'tax_amount' => $value['tax_amount'] ?? "",
                            // 'tax_percent' => $value['tax_percent'] ?? "",
                            // 'net_amount' => $value['net_amount'] ?? "",
                            'created_at' => Carbon::now(),
                            'created_by' => $request->login_user_id,
                        ];
                        PaymentVoucherDetail::create($insert);
                    }
                    if ($value['row_status'] == 'U') {
                        $update = [
                            'sort_order' => $value['sort_order'] ?? "",
                            'account_id' => $value['account_id'] ?? "",
                            'cheque_no' => $value['cheque_no'] ?? "",
                            'cheque_date' => $value['cheque_date'] ?? "",
                            // 'document_amount' => $value['document_amount'] ?? "",
                            'payment_amount' => $value['payment_amount'] ?? "",
                            // 'tax_amount' => $value['tax_amount'] ?? "",
                            // 'tax_percent' => $value['tax_percent'] ?? "",
                            // 'net_amount' => $value['net_amount'] ?? "",
                            'updated_at' => Carbon::now(),
                            'updated_by' => $request->login_user_id,
                        ];
                        PaymentVoucherDetail::where('payment_voucher_detail_id', $value['payment_voucher_detail_id'])->update($update);
                    }
                    if ($value['row_status'] == 'D') {
                        PaymentVoucherDetail::where('payment_voucher_detail_id', $value['payment_voucher_detail_id'])->delete();
                    }

                    if ($value['row_status'] != 'D')
                        if ((float)$value['payment_amount'] > 0)
                            Ledger::create([
                                'ledger_id' => $this->get_uuid(),
                                'company_id' => $request->company_id,
                                'company_branch_id' => $request->company_branch_id,
                                'document_type_id' => $this->document_type_id,
                                'document_id' => $id,
                                'document_detail_id' => $value['payment_voucher_detail_id'] ?? $detail_uuid,
                                'document_identity' => $request->document_identity ?? "",
                                'document_date' => $request->document_date ?? "",
                                'sort_order' => $value['sort_order'] ?? "",
                                'partner_type' => '',
                                'partner_id' => '',
                                'ref_document_type_id' => "",
                                'ref_document_identity' => "",
                                'account_id' => $value['account_id'] ?? "",
                                'remarks' => '',
                                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                                'document_debit' => 0,
                                'document_credit' => $value['payment_amount'] ?? "",
                                'base_currency_id' => $base_currency_id,
                                'conversion_rate' => $conversion_rate,
                                'debit' => 0,
                                'credit' => ($value['payment_amount'] ?? 0) * $conversion_rate,
                                'document_amount' => $value['payment_amount'] ?? "",
                                'amount' => ($value['payment_amount'] ?? 0) * $conversion_rate,
                                'created_at' => Carbon::now(),
                                'created_by_id' => $request->login_user_id,
                                'cheque_no' => $value['cheque_no'] ?? "",
                                'cheque_date' => $value['cheque_date'] ?? "",
                            ]);

                    // if ((float)$value['tax_amount'] > 0)
                    //     Ledger::create([
                    //         'ledger_id' => $this->get_uuid(),
                    //         'company_id' => $request->company_id,
                    //         'company_branch_id' => $request->company_branch_id,
                    //         'document_type_id' => $this->document_type_id,
                    //         'document_id' => $id,
                    //         'document_detail_id' => $value['payment_voucher_detail_id'] ?? $detail_uuid,
                    //         'document_identity' => $request->document_identity ?? "",
                    //         'document_date' => $request->document_date ?? "",
                    //         'sort_order' => $value['sort_order'] ?? "",
                    //         'partner_type' => '',
                    //         'partner_id' => '',
                    //         'ref_document_type_id' => "",
                    //         'ref_document_identity' => "",
                    //         'account_id' => $value['account_id'] ?? "",
                    //         'remarks' => '',
                    //         'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                    //         'document_debit' => 0,
                    //         'document_credit' => $value['tax_amount'] ?? "",
                    //         'base_currency_id' => $base_currency_id,
                    //         'conversion_rate' => $conversion_rate,
                    //         'debit' => 0,
                    //         'credit' => ($value['tax_amount'] ?? 0) * $conversion_rate,
                    //         'document_amount' => $value['tax_amount'] ?? "",
                    //         'amount' => ($value['tax_amount'] ?? 0) * $conversion_rate,
                    //         'created_at' => Carbon::now(),
                    //         'created_by_id' => $request->login_user_id,
                    //         'cheque_no' => $value['cheque_no'] ?? "",
                    //         'cheque_date' => $value['cheque_date'] ?? "",
                    //     ]);
                }
            }
            DB::commit();

            return $this->jsonResponse(['payment_voucher_id' => $id], 200, "Update Payment Voucher Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Payment Voucher Updating Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while updating Payment Voucher." . $e->getMessage(), 500, "Transaction Failed");
        }
    }
    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'payment_voucher', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");
        $data  = PaymentVoucher::where('payment_voucher_id', $id)->first();
        if ($data) {
            $data->delete();
            Ledger::where('document_id', $id)
                ->where('document_type_id', $this->document_type_id)
                ->delete();
            PaymentVoucherDetail::where('payment_voucher_id', $id)->delete();
        }
        return $this->jsonResponse(['payment_voucher_id' => $id], 200, "Delete Payment Voucher Successfully!");
    }
    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'payment_voucher', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        try {
            if (isset($request->id) && !empty($request->id) && is_array($request->id)) {
                foreach ($request->id as $payment_voucher_id) {
                    $user = PaymentVoucher::where(['payment_voucher_id' => $payment_voucher_id])->first();
                    if ($user) {
                        $user->delete();
                        Ledger::where('document_id', $payment_voucher_id)
                            ->where('document_type_id', $this->document_type_id)
                            ->delete();
                        PaymentVoucherDetail::where('payment_voucher_id', $payment_voucher_id)->delete();
                    }
                }
            }

            return $this->jsonResponse('Deleted', 200, "Delete Payment Voucher successfully!");
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
