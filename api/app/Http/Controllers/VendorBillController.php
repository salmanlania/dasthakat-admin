<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Ledger;
use App\Models\Supplier;
use App\Models\VendorBill;
use App\Models\VendorBillDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VendorBillController extends Controller
{
    protected $document_type_id = 63;
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
        $sort_column = $request->input('sort_column', 'vendor_bill.created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $data = VendorBill::LeftJoin('supplier as s', 's.supplier_id', '=', 'vendor_bill.supplier_id')
            ->LeftJoin('accounts as a', 'a.account_id', '=', 'vendor_bill.transaction_account_id');

        $data = $data->where('vendor_bill.company_id', '=', $request->company_id);
        $data = $data->where('vendor_bill.company_branch_id', '=', $request->company_branch_id);

        if (!empty($document_identity)) $data->where('vendor_bill.document_identity', 'like', "%$document_identity%");
        if (!empty($remarks)) $data->where('vendor_bill.remarks', 'like', "%$remarks%");
        if (!empty($total_amount)) $data->where('vendor_bill.total_amount', 'like', "%$total_amount%");
        if (!empty($document_date)) $data->where('vendor_bill.document_date', $document_date);
        if (!empty($supplier_id)) $data->where('s.supplier_id', $supplier_id);
        if (!empty($transaction_account_id)) $data->where('a.account_id', $transaction_account_id);

        if (!empty($search)) {
            $search = strtolower($search);
            $data->where(function ($query) use ($search) {
                $query->where('vendor_bill.document_identity', 'like', "%$search%")
                    ->orWhere('vendor_bill.remarks', 'like', "%$search%")
                    ->orWhere('a.name', 'like', "%$search%")
                    ->orWhere('s.name', 'like', "%$search%");
            });
        }

        $data = $data->select(
            'vendor_bill.*',
            's.supplier_code',
            's.name as supplier_name',
            'a.name as transaction_account_name',
        );
        $data = $data->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function show($id, Request $request)
    {

        $data = VendorBill::with('details', 'details.account', 'supplier', 'transaction_account', 'document_currency', 'base_currency')->find($id);

        if (!$data) {
            return $this->jsonResponse(null, 404, "Vendor Bill not found");
        }

        return $this->jsonResponse($data, 200, "Vendor Bill Data");
    }


    public function validateRequest($request, $id = null)
    {
        $rules = [
            'document_date' => 'required|date',
            'supplier_id' => 'required',
            'total_amount' => 'required|numeric|min:0',
            'details' => 'required|array|min:1',
            'details.*.amount' => 'required|numeric|min:0',
            'details.*.account_id' => 'required',
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
        if (!isPermission('add', 'vendor_bill', $request->permission_list))
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
            $outstanding_account_id = Supplier::where('supplier_id', $request->supplier_id)->pluck('outstanding_account_id')->first();
            if (empty($outstanding_account_id)) return $this->jsonResponse(null, 400, "Vendor Outstanding Account not found");

            $conversion_rate = 1;

            $data = [
                'company_id' => $request->company_id ?? "",
                'company_branch_id' => $request->company_branch_id ?? "",
                'vendor_bill_id' => $uuid,
                'document_type_id' => $document['document_type_id'] ?? "",
                'document_no' => $document['document_no'] ?? "",
                'document_prefix' => $document['document_prefix'] ?? "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date,
                'base_currency_id' => $base_currency_id,
                'document_currency_id' => $request->document_currency_id,
                'transaction_account_id' => $outstanding_account_id,
                'supplier_id' => $request->supplier_id,
                'conversion_rate' => $conversion_rate,
                'total_amount' => $request->total_amount,
                'remarks' => $request->remarks,
                'created_at' => Carbon::now(),
                'created_by' => $request->login_user_id,
            ];
            VendorBill::create($data);

            Ledger::create([
                'ledger_id' => $this->get_uuid(),
                'company_id' => $request->company_id,
                'company_branch_id' => $request->company_branch_id,
                'document_type_id' => $this->document_type_id,
                'document_id' => $uuid ?? "",
                'document_detail_id' => "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date,
                'sort_order' => 0,
                'partner_type' => 'Vendor',
                'partner_id' => $request->supplier_id,
                'event_id' => "",
                'cost_center_id' => "",
                'ref_document_type_id' => "",
                'ref_document_identity' => "",
                'account_id' => $outstanding_account_id ?? "",
                'remarks' => $request->remarks,
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
            ]);

            if ($request->details) {
                foreach ($request->details as $key => $value) {
                    $detail_uuid = $this->get_uuid();
                    $data = [
                        'vendor_bill_id' => $uuid,
                        'vendor_bill_detail_id' => $detail_uuid,
                        'sort_order' => $value['sort_order'] ?? "",
                        'account_id' => $value['account_id'] ?? "",
                        'amount' => $value['amount'] ?? "",
                        'remarks' => $value['remarks'] ?? "",
                        'created_at' => Carbon::now(),
                        'created_by' => $request->login_user_id,
                    ];

                    VendorBillDetail::create($data);

                    if ((float)$value['amount'] > 0) {
                        Ledger::create([
                            'ledger_id' => $this->get_uuid(),
                            'company_id' => $request->company_id,
                            'company_branch_id' => $request->company_branch_id,
                            'document_type_id' => $this->document_type_id,
                            'document_id' => $uuid,
                            'document_detail_id' => $detail_uuid,
                            'document_identity' => $document['document_identity'] ?? "",
                            'document_date' => $request->document_date,
                            'sort_order' => $value['sort_order'] ?? "",
                            'partner_type' => '',
                            'partner_id' => '',
                            'event_id' => "",
                            'cost_center_id' => "",
                            'ref_document_type_id' => "",
                            'ref_document_identity' => "",
                            'account_id' => $value['account_id'] ?? "",
                            'remarks' => '',
                            'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                            'document_debit' => $value['amount'] ?? "",
                            'document_credit' => 0,
                            'base_currency_id' => $base_currency_id,
                            'conversion_rate' => $conversion_rate,
                            'debit' => ($value['amount'] ?? 0) * $conversion_rate,
                            'credit' => 0,
                            'document_amount' => $value['amount'] ?? "",
                            'amount' => ($value['amount'] ?? 0) * $conversion_rate,
                            'created_at' => Carbon::now(),
                            'created_by_id' => $request->login_user_id,
                        ]);
                    }
                }
            }

            DB::commit();
            return $this->jsonResponse(['vendor_bill_id' => $uuid], 200, "Add Vendor Bill Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Vendor Bill Store Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while saving Vendor Bill." . $e->getMessage(), 500, "Transaction Failed");
        }
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'vendor_bill', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");


        // Validation Rules
        $isError = $this->validateRequest($request->all(), $id);
        if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

        $base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
        $outstanding_account_id = Supplier::where('supplier_id', $request->supplier_id)->pluck('outstanding_account_id')->first();
        if (empty($outstanding_account_id)) return $this->jsonResponse(null, 400, "Vendor Outstanding Account not found");
        $default_currency_id = Currency::where('company_id', $request->company_id)
            ->where('company_branch_id', $request->company_branch_id)
            ->value('currency_id');
        $conversion_rate = 1;

        DB::beginTransaction();
        try {
            $data  = VendorBill::where('vendor_bill_id', $id)->first();
            $data->company_id = $request->company_id;
            $data->company_branch_id = $request->company_branch_id;
            $data->document_date = $request->document_date;
            $data->document_currency_id = $request->document_currency_id;
            $data->transaction_account_id = $outstanding_account_id;
            $data->conversion_rate = $conversion_rate;
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
                'document_identity' => $data->document_identity,
                'document_date' => $request->document_date,
                'sort_order' => 0,
                'partner_type' => 'Vendor',
                'partner_id' => $request->supplier_id,
                'event_id' => "",
                'cost_center_id' => "",
                'ref_document_type_id' => "",
                'ref_document_identity' => "",
                'account_id' => $outstanding_account_id ?? "",
                'remarks' => $request->remarks,
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
            ]);

            if ($request->details) {
                foreach ($request->details as $value) {
                    $detail_uuid = null;
                    if ($value['row_status'] == 'I') {
                        $detail_uuid = $this->get_uuid();
                        $insert = [
                            'vendor_bill_id' => $id,
                            'vendor_bill_detail_id' => $detail_uuid,
                            'sort_order' => $value['sort_order'] ?? "",
                            'account_id' => $value['account_id'] ?? "",
                            'amount' => $value['amount'] ?? "",
                            'remarks' => $value['remarks'] ?? "",
                            'created_at' => Carbon::now(),
                            'created_by' => $request->login_user_id,
                        ];
                        VendorBillDetail::create($insert);
                    }
                    if ($value['row_status'] == 'U') {
                        $update = [
                            'sort_order' => $value['sort_order'] ?? "",
                            'account_id' => $value['account_id'] ?? "",
                            'amount' => $value['amount'] ?? "",
                            'remarks' => $value['remarks'] ?? "",
                            'updated_at' => Carbon::now(),
                            'updated_by' => $request->login_user_id,
                        ];
                        VendorBillDetail::where('vendor_bill_detail_id', $value['vendor_bill_detail_id'])->update($update);
                    }
                    if ($value['row_status'] == 'D') {
                        VendorBillDetail::where('vendor_bill_detail_id', $value['vendor_bill_detail_id'])->delete();
                    }

                    if ($value['row_status'] != 'D') {
                        if ((float)$value['amount'] > 0) {

                            Ledger::create([
                                'ledger_id' => $this->get_uuid(),
                                'company_id' => $request->company_id,
                                'company_branch_id' => $request->company_branch_id,
                                'document_type_id' => $this->document_type_id,
                                'document_id' => $id,
                                'document_detail_id' => "",
                                'document_identity' => $request->document_identity ?? "",
                                'document_date' => $request->document_date,
                                'sort_order' => $value['sort_order'],
                                'event_id' => '',
                                'cost_center_id' => '',
                                'partner_type' => '',
                                'partner_id' => '',
                                'ref_document_type_id' => "",
                                'ref_document_identity' => "",
                                'account_id' => $value['account_id'] ?? "",
                                'remarks' => $value['remarks'] ?? "",
                                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                                'document_debit' => $value['amount'] ?? "",
                                'document_credit' => 0,
                                'base_currency_id' => $base_currency_id,
                                'conversion_rate' => $conversion_rate,
                                'debit' => ($value['amount'] ?? 0) * $conversion_rate,
                                'credit' => 0,
                                'document_amount' => $value['amount'] ?? "",
                                'amount' => ($value['amount'] ?? 0) * $conversion_rate,
                                'created_at' => Carbon::now(),
                                'created_by_id' => $request->login_user_id,
                            ]);
                        }
                    }
                }
            }
            DB::commit();

            return $this->jsonResponse(['vendor_bill_id' => $id], 200, "Update Vendor Bill Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Vendor Bill Updating Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while updating Vendor Bill." . $e->getMessage(), 500, "Transaction Failed");
        }
    }
    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'vendor_bill', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");
        $record  = VendorBill::where('vendor_bill_id', $id)->first();
        if ($record) {
            $record->delete();
            Ledger::where('document_id', $id)
                ->where('document_type_id', $this->document_type_id)
                ->delete();

            VendorBillDetail::where('vendor_bill_id', $id)->delete();
        }
        return $this->jsonResponse(['vendor_bill_id' => $id], 200, "Delete Vendor Bill Successfully!");
    }
    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'vendor_bill', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        try {
            if (isset($request->id) && !empty($request->id) && is_array($request->id)) {
                foreach ($request->id as $vendor_bill_id) {
                    $record = VendorBill::where(['vendor_bill_id' => $vendor_bill_id])->first();
                    if ($record) {
                        $record->delete();
                        Ledger::where('document_id', $vendor_bill_id)
                            ->where('document_type_id', $this->document_type_id)
                            ->delete();
                        VendorBillDetail::where('vendor_bill_id', $vendor_bill_id)->delete();
                    }
                }
            }

            return $this->jsonResponse('Deleted', 200, "Delete Vendor Bill successfully!");
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
