<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Setting;
use App\Models\JournalVoucher;
use App\Models\JournalVoucherDetail;
use App\Models\Ledger;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class JournalVoucherController extends Controller
{
    protected $document_type_id = 65;
    protected $db;

    public function index(Request $request)
    {
        $document_identity = $request->input('document_identity', '');
        $document_date = $request->input('document_date', '');
        $remarks = $request->input('remarks', '');
        $total_debit = $request->input('total_debit', '');
        $total_credit = $request->input('total_credit', '');
        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $data = JournalVoucher::query();

        $data = $data->where('company_id', '=', $request->company_id);
        $data = $data->where('company_branch_id', '=', $request->company_branch_id);

        if (!empty($document_identity)) $data->where('document_identity', 'like', "%$document_identity%");
        if (!empty($total_debit)) $data->where('total_debit', 'like', "%$total_debit%");
        if (!empty($total_credit)) $data->where('total_credit', 'like', "%$total_credit%");
        if (!empty($remarks)) $data->where('remarks', 'like', "%$remarks%");
        if (!empty($document_date)) $data->where('document_date', $document_date);

        if (!empty($search)) {
            $search = strtolower($search);
            $data->where(function ($query) use ($search) {
                $query
                    ->orWhere('document_identity', 'like', "%$search%")
                    ->orWhere('remarks', 'like', "%$search%");
            });
        }
        $data = $data->select(
            '*',
        );

        $data = $data->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);


        return response()->json($data);
    }


    public function show($id, Request $request)
    {

        $data = JournalVoucher::with('details','details.account')
            ->where('journal_voucher.journal_voucher_id', $id)
            ->first();

        if (!$data) {
            return $this->jsonResponse(null, 404, "Journal Voucher not found");
        }

        return $this->jsonResponse($data, 200, "Journal Voucher Data");
    }


    public function validateRequest($request, $id = null)
    {
        $rules = [
            'document_date' => 'required|date',
            'total_debit' => 'required|numeric|min:0',
            'total_credit' => 'required|numeric|min:0',
            'details' => 'required|array|min:1',
            'details.*.account_id' => 'required|string|size:36',
            'details.*.debit' => 'required|numeric|min:0',
            'details.*.credit' => 'required|numeric|min:0',
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
        if (!isPermission('add', 'journal_voucher', $request->permission_list))
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
                'journal_voucher_id' => $uuid,
                'document_type_id' => $document['document_type_id'] ?? "",
                'document_no' => $document['document_no'] ?? "",
                'document_prefix' => $document['document_prefix'] ?? "",
                'document_identity' => $document['document_identity'] ?? "",
                'document_date' => $request->document_date ?? "",
                'base_currency_id' => $base_currency_id ?? "",
                'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                'conversion_rate' => $conversion_rate,
                'total_debit' => $request->total_debit ?? "",
                'total_credit' => $request->total_credit ?? "",
                'remarks' => $request->remarks ?? "",
                'created_at' => Carbon::now(),
                'created_by' => $request->login_user_id,
            ];
            JournalVoucher::create($data);

            if ($request->details) {
                foreach ($request->details as $key => $value) {
                    $detail_uuid = $this->get_uuid();
                    $data = [
                        'journal_voucher_id' => $uuid,
                        'journal_voucher_detail_id' => $detail_uuid,
                        'sort_order' => $value['sort_order'] ?? "",
                        'account_id' => $value['account_id'] ?? "",
                        'debit' => $value['debit'] ?? "",
                        'credit' => $value['credit'] ?? "",
                        'remarks' => $value['remarks'] ?? "",
                        'created_at' => Carbon::now(),
                        'created_by' => $request->login_user_id,
                    ];

                    JournalVoucherDetail::create($data);

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
                        'ref_document_type_id' => '',
                        'ref_document_identity' => '',
                        'account_id' => $value['account_id'] ?? "",
                        'remarks' => $value['remarks'] ?? "",
                        'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                        'document_debit' => $value['debit'] ?? "",
                        'document_credit' => $value['credit'] ?? "",
                        'base_currency_id' => $base_currency_id,
                        'conversion_rate' => $conversion_rate,
                        'debit' => $value['debit'] ?? "",
                        'credit' => $value['credit'] ?? "",
                        'document_amount' => "",
                        'amount' => "",
                        'created_at' => Carbon::now(),
                        'created_by_id' => $request->login_user_id,
                    ]);
                }
            }

            DB::commit();
            return $this->jsonResponse(['journal_voucher_id' => $uuid], 200, "Add Journal Voucher Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Journal Voucher Store Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while saving journal voucher." . $e->getMessage(), 500, "Transaction Failed");
        }
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'journal_voucher', $request->permission_list))
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
            $data  = JournalVoucher::where('journal_voucher_id', $id)->first();
            $data->company_id = $request->company_id;
            $data->company_branch_id = $request->company_branch_id;
            $data->document_date = $request->document_date;
            $data->document_currency_id = $request->document_currency_id ?? $default_currency_id;
            $data->conversion_rate = $conversion_rate;
            $data->total_debit = $request->total_debit;
            $data->total_credit = $request->total_credit;
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
                            'journal_voucher_id' => $id,
                            'journal_voucher_detail_id' => $detail_uuid,
                            'sort_order' => $value['sort_order'] ?? 0,
                            'account_id' => $value['account_id'] ?? "",
                            'debit' => $value['debit'] ?? "",
                            'credit' => $value['credit'] ?? "",
                            'remarks' => $value['remarks'] ?? "",
                            'created_at' => Carbon::now(),
                            'created_by' => $request->login_user_id,
                        ];
                        JournalVoucherDetail::create($insert);
                    }
                    if ($value['row_status'] == 'U') {
                        $update = [
                            'sort_order' => $value['sort_order'] ?? 0,
                            'account_id' => $value['account_id'] ?? "",
                            'debit' => $value['debit'] ?? "",
                            'credit' => $value['credit'] ?? "",
                            'remarks' => $value['remarks'] ?? "",
                            'updated_at' => Carbon::now(),
                            'updated_by' => $request->login_user_id,
                        ];
                        JournalVoucherDetail::where('journal_voucher_detail_id', $value['journal_voucher_detail_id'])->update($update);
                    }
                    if ($value['row_status'] == 'D') {
                        JournalVoucherDetail::where('journal_voucher_detail_id', $value['journal_voucher_detail_id'])->delete();
                    }

                    if ($value['row_status'] != 'D') {
                        Ledger::create([
                            'ledger_id' => $this->get_uuid(),
                            'company_id' => $request->company_id,
                            'company_branch_id' => $request->company_branch_id,
                            'document_type_id' => $this->document_type_id,
                            'document_id' => $id,
                            'document_detail_id' => $value['journal_voucher_detail_id'] ?? $detail_uuid,
                            'document_identity' => $request->document_identity ?? "",
                            'document_date' => $request->document_date ?? "",
                            'sort_order' => $value['sort_order'] ?? "",
                            'partner_type' => '',
                            'partner_id' => '',
                            'ref_document_type_id' => '',
                            'ref_document_identity' => '',
                            'account_id' => $value['account_id'] ?? "",
                            'remarks' => $value['remarks'] ?? "",
                            'document_currency_id' => $request->document_currency_id ?? $default_currency_id,
                            'document_debit' => $value['debit'] ?? "",
                            'document_credit' => $value['credit'] ?? "",
                            'base_currency_id' => $base_currency_id,
                            'conversion_rate' => $conversion_rate,
                            'debit' => $value['debit'] ?? "",
                            'credit' => $value['credit'] ?? "",
                            'document_amount' => "",
                            'amount' => "",
                            'created_at' => Carbon::now(),
                            'created_by_id' => $request->login_user_id,
                        ]);
                    }
                }
            }
            DB::commit();

            return $this->jsonResponse(['journal_voucher_id' => $id], 200, "Update Journal Voucher Successfully!");
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Journal Voucher Updating Error: ' . $e->getMessage());
            return $this->jsonResponse("Something went wrong while updating Journal Voucher." . $e->getMessage(), 500, "Transaction Failed");
        }
    }
    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'journal_voucher', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");
        $record  = JournalVoucher::where('journal_voucher_id', $id)->first();
        if ($record) {
            $record->delete();
            Ledger::where('document_id', $id)
                ->where('document_type_id', $this->document_type_id)
                ->delete();
            JournalVoucherDetail::where('journal_voucher_id', $id)->delete();
        }
        return $this->jsonResponse(['journal_voucher_id' => $id], 200, "Delete Journal Voucher Successfully!");
    }
    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'journal_voucher', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        try {
            if (isset($request->id) && !empty($request->id) && is_array($request->id)) {
                foreach ($request->id as $journal_voucher_id) {
                    $record = JournalVoucher::where(['journal_voucher_id' => $journal_voucher_id])->first();
                    if ($record) {
                        $record->delete();
                        Ledger::where('document_id', $journal_voucher_id)
                            ->where('document_type_id', $this->document_type_id)
                            ->delete();
                        JournalVoucherDetail::where('journal_voucher_id', $journal_voucher_id)->delete();
                    }
                }
            }

            return $this->jsonResponse('Deleted', 200, "Delete Journal Voucher successfully!");
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
