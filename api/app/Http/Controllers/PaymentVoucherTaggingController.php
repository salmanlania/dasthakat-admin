<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\PaymentVoucherTaggingDetail;
use App\Models\Ledger;
use App\Models\PaymentVoucherTagging;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentVoucherTaggingController extends Controller
{
    protected $document_type_id = 62;
    protected $db;

    public function index(Request $request)
    {
        $document_identity = $request->input('document_identity', '');
        $document_date = $request->input('document_date', '');
        $supplier_id = $request->input('supplier_id', '');
        $transaction_account_id = $request->input('transaction_account_id', '');
        $remarks = $request->input('remarks', '');
        $total_amount = $request->input('total_amount', '');
        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'payment_voucher_taging.created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $data = PaymentVoucherTagging::LeftJoin('supplier as c', 'c.supplier_id', '=', 'payment_voucher_taging.supplier_id')
            ->LeftJoin('accounts as a', 'a.account_id', '=', 'payment_voucher_taging.transaction_account_id');

        $data = $data->where('payment_voucher_taging.company_id', '=', $request->company_id);
        $data = $data->where('payment_voucher_taging.company_branch_id', '=', $request->company_branch_id);

        if (!empty($document_identity)) $data->where('payment_voucher_taging.document_identity', 'like', "%$document_identity%");
        if (!empty($total_amount)) $data->where('payment_voucher_taging.total_amount', 'like', "%$total_amount%");
        if (!empty($remarks)) $data->where('payment_voucher_taging.remarks', 'like', "%$remarks%");
        if (!empty($document_date)) $data->where('payment_voucher_taging.document_date', $document_date);
        if (!empty($supplier_id)) $data->where('c.supplier_id', $supplier_id);
        if (!empty($transaction_account_id)) $data->where('a.account_id', $transaction_account_id);

        if (!empty($search)) {
            $search = strtolower($search);
            $data->where(function ($query) use ($search) {
                $query
                    ->where('c.name', 'like', "%$search%")
                    ->orWhere('payment_voucher_taging.document_identity', 'like', "%$search%")
                    ->orWhere('payment_voucher_taging.remarks', 'like', "%$search%")
                    ->orWhere('a.name', 'like', "%$search%");
            });
        }
        $data = $data->select(
            'payment_voucher_taging.*',
            'c.name as supplier_name',
            'a.name as transaction_account_name'
        );

        $data = $data->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);


        return response()->json($data);
    }


    public function show($id, Request $request)
    {

        $data = PaymentVoucherTagging::with('details', 'supplier', 'transaction_account', 'document_currency', 'base_currency', 'details.payment_voucher_detail', 'details.account')
            ->where('payment_voucher_taging_id', $id)
            ->first();

        if (!$data) {
            return $this->jsonResponse(null, 404, "Payment Voucher Tagging not found");
        }

        return $this->jsonResponse($data, 200, "Payment Voucher Tagging Data");
    }


    public function validateRequest($request, $id = null)
    {
        $rules = [
            'supplier_id' => 'required|string|size:36',
            'payment_voucher_id' => 'required|string|size:36',
            'total_amount' => 'required|numeric|min:0',
            'details' => 'required|array|min:1',
            'details.*.purchase_invoice_id' => 'required|string|size:36',
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
        if (!isPermission('add', 'payment_voucher_taging', $request->permission_list))
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
                'payment_voucher_taging_id' => $uuid,
                'document_type_id' => $document['document_type_id'] ?? "",
                'document_no' => $document['document_no'] ?? "",
                'document_prefix' => $document['document_prefix'] ?? "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => Carbon::now() ,
                'supplier_id' => $request->supplier_id ?? "",
                'payment_voucher_id' => $request->payment_voucher_id ?? "",
                'base_currency_id' => $base_currency_id ?? "",
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'conversion_rate' => $conversion_rate,
                'total_amount' => $request->total_amount ?? "",
                'remarks' => $request->remarks ?? "",
                'created_at' => Carbon::now(),
                'created_by' => $request->login_user_id,
            ];
            PaymentVoucherTagging::create($data);


            if ($request->details) {
                foreach ($request->details as $key => $value) {
                    $detail_uuid = $this->get_uuid();
                    $data = [
                        'payment_voucher_taging_id' => $uuid,
                        'payment_voucher_taging_detail_id' => $detail_uuid,
                        'sort_order' => $value['sort_order'] ?? "",
                        'purchase_invoice_id' => $value['purchase_invoice_id'] ?? "",
                        'ref_document_identity' => $value['ref_document_identity'] ?? "",
                        'amount' => $value['amount'] ?? "",
                        'remarks' => $value['remarks'] ?? "",
                        'created_at' => Carbon::now(),
                        'created_by' => $request->login_user_id,
                    ];

                    PaymentVoucherTaggingDetail::create($data);
                }
            }

            DB::commit();
            return $this->jsonResponse(['payment_voucher_taging_id' => $uuid], 200, "Add Payment Voucher Tagging Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Payment Voucher Tagging Store Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while saving Payment Voucher Tagging." . $e->getMessage(), 500, "Transaction Failed");
        }
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'payment_voucher_taging', $request->permission_list))
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
            $data  = PaymentVoucherTagging::where('payment_voucher_taging_id', $id)->first();
            $data->company_id = $request->company_id;
            $data->company_branch_id = $request->company_branch_id;
            $data->supplier_id = $request->supplier_id;
            $data->payment_voucher_id = $request->payment_voucher_id;
            $data->document_currency_id = $request->document_currency_id ?? $default_currency_id;
            $data->conversion_rate = $conversion_rate;
            $data->base_currency_id = $base_currency_id;
            $data->total_amount = $request->total_amount;
            $data->remarks = $request->remarks;
            $data->updated_at = Carbon::now();
            $data->updated_by = $request->login_user_id;
            $data->save();

            if ($request->details) {
                foreach ($request->details as $value) {
                    $detail_uuid = null;
                    if ($value['row_status'] == 'I') {
                        $detail_uuid = $this->get_uuid();
                        $insert = [
                            'payment_voucher_taging_id' => $id,
                            'payment_voucher_taging_detail_id' => $detail_uuid,
                            'sort_order' => $value['sort_order'] ?? 0,
                            'purchase_invoice_id' => $value['purchase_invoice_id'] ?? "",
                            'ref_document_identity' => $value['ref_document_identity'] ?? "",
                            'amount' => $value['amount'] ?? "",
                            'remarks' => $value['remarks'] ?? "",
                            'created_at' => Carbon::now(),
                            'created_by' => $request->login_user_id,
                        ];
                        PaymentVoucherTaggingDetail::create($insert);
                    }
                    if ($value['row_status'] == 'U') {
                        $update = [
                            'sort_order' => $value['sort_order'] ?? 0,
                            'purchase_invoice_id' => $value['purchase_invoice_id'] ?? "",
                            'ref_document_identity' => $value['ref_document_identity'] ?? "",
                            'amount' => $value['amount'] ?? "",
                            'remarks' => $value['remarks'] ?? "",
                            'updated_at' => Carbon::now(),
                            'updated_by' => $request->login_user_id,
                        ];
                        PaymentVoucherTaggingDetail::where('payment_voucher_taging_detail_id', $value['payment_voucher_taging_detail_id'])->update($update);
                    }
                    if ($value['row_status'] == 'D') {
                        PaymentVoucherTaggingDetail::where('payment_voucher_taging_detail_id', $value['payment_voucher_taging_detail_id'])->delete();
                    }
                }
            }
            DB::commit();

            return $this->jsonResponse(['payment_voucher_taging_id' => $id], 200, "Update Payment Voucher Tagging Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Payment Voucher Tagging Updating Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while updating Payment Voucher Tagging." . $e->getMessage(), 500, "Transaction Failed");
        }
    }
    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'payment_voucher_taging', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");
        $data  = PaymentVoucherTagging::where('payment_voucher_taging_id', $id)->first();
        if ($data) {
            $data->delete();
            PaymentVoucherTaggingDetail::where('payment_voucher_taging_id', $id)->delete();
        }
        return $this->jsonResponse(['payment_voucher_taging_id' => $id], 200, "Delete Payment Voucher Tagging Successfully!");
    }
    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'payment_voucher_taging', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        try {
            if (isset($request->id) && !empty($request->id) && is_array($request->id)) {
                foreach ($request->id as $payment_voucher_taging_id) {
                    $user = PaymentVoucherTagging::where(['payment_voucher_taging_id' => $payment_voucher_taging_id])->first();
                    if ($user) {
                        $user->delete();
                        PaymentVoucherTaggingDetail::where('payment_voucher_taging_id', $payment_voucher_taging_id)->delete();
                    }
                }
            }

            return $this->jsonResponse('Deleted', 200, "Delete Payment Voucher Tagging successfully!");
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
