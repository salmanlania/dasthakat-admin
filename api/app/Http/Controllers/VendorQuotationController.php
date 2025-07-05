<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\QuotationDetail;
use App\Models\Supplier;
use App\Models\VendorQuotationDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VendorQuotationController extends Controller
{
	public function validateRequest($request)
	{
		$rules = [
			'vendor_id' => ['required'],
			'quotation_id' => ['required'],
			'quotation_detail_id' => ['required'],
		];

		$validator = Validator::make($request, $rules);
		if ($validator->fails()) {
			$firstError = $validator->errors()->first();
			return $firstError;
		}
		return [];
	}

	public function validateStoreRequest($request)
	{
		$rules = [
			'quotation_id' => ['required'],
			'quotation_detail' => ['required', 'array'],
			'quotation_detail.*.vendor_id' => ['required'],
			'quotation_detail.*.quotation_detail_id' => ['required'],
		];

		$validator = Validator::make($request, $rules);
		if ($validator->fails()) {
			$firstError = $validator->errors()->first();
			return $firstError;
		}
		return [];
	}

	public function sendRFQ(Request $request)
	{
		$isError = $this->validateRequest($request->all());
		if (!empty($isError))
			return $this->jsonResponse($isError, 400, 'Request Failed!');

		$detail = VendorQuotationDetail::where('quotation_id', $request->quotation_id)
			->where('quotation_detail_id', $request->quotation_detail_id)
			->where('vendor_id', $request->vendor_id)
			->select('vendor_rate')
			->first();

		if (empty($detail)) {
			return $this->jsonResponse([], 400, 'Quotation Item Not Found!');
		}

		$data['vendor'] = Supplier::where('supplier_id',$request->vendor_id)
			->select('supplier_id', 'name', 'email')
			->first();
		$data['quotation'] = Quotation::with('event:event_no,event_code', 'vessel:name')
			->where('quotation_id',$request->quotation_id)
			->select('quotation_id', 'document_identity', 'document_date')
			->first();
		$data['quotation_detail'] = QuotationDetail::with('product:impa_code,name,short_code,product_code', 'product_type:name', 'unit:name')
			->where('quotation_id',$request->quotation_id)
			->select('quotation_detail_id', 'product_type_id')
			->first();

		$data['vendor_rate'] = $detail->vendor_rate;

		$jsonData = json_encode($data);
		$encoded = rtrim(strtr(base64_encode($jsonData), '+/', '-_'), '=');
		$data['link'] = "http://localhost:5173/vendor-platform/quotation/{$encoded}";

		$payload = [
			'template' => 'otp-verify-template',
			'data' => $data,
			'email' => $data['vendor']->email ?? '',
			'name' => $data['vendor']->name,
			'subject' => 'New Request Quotation ' . $data['quotation']->document_identity,
			'message' => '',
		];

		try {
			$this->sendEmail($payload);
		} catch (\Exception $e) {
			return $this->jsonResponse([], 400, 'RFQ Sent Failed!' . $e->getMessage());
		}

		return $this->jsonResponse([], 200, 'RFQ Sent Successfully!');
	}

	public function show($id)
	{
		$data = VendorQuotationDetail::with("quotation_detail","quotation_detail.product_type","quotation_detail.product","quotation_detail.unit","vendor")->where('quotation_id', $id)->get();

		if (empty($data)) {
			return $this->jsonResponse([], 400, 'Quotation Item(s) Not Found!');
		}
		return $this->jsonResponse($data, 200, 'Quotation Vendor Data Fetched Successfully!');
	}

	public function store(Request $request)
	{
		$isError = $this->validateStoreRequest($request->all());
		if (!empty($isError)) {
			return $this->jsonResponse($isError, 400, 'Request Failed!');
		}

		DB::beginTransaction();

		try {
			
			$quotation_id = $request->quotation_id;
			VendorQuotationDetail::where('quotation_id', $quotation_id)->delete();
			$data = [];
			$sort_order = 1;
			foreach ($request->quotation_detail as $detail) {
				$data[] = [
					'company_id' => $request->company_id ?? '',
					'company_branch_id' => $request->company_branch_id ?? '',
					'vendor_quotation_detail_id' => $this->get_uuid(),
					'quotation_id' => $quotation_id ?? '',
					'sort_order' => $sort_order,
					'quotation_detail_id' => $detail['quotation_detail_id'],
					'vendor_id' => $detail['vendor_id'] ?? '',
					'vendor_rate' => $detail['vendor_rate'] ?? '',
					'is_primary_vendor' => $detail['is_primary_vendor'] ?? 0,
					'vendor_part_no' => $detail['vendor_part_no'] ?? '',
					'vendor_notes' => $detail['vendor_notes'] ?? '',
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id,
				];
				$sort_order++;
				if($detail['is_primary_vendor'] == 1){
					QuotationDetail::where('quotation_detail_id', $detail['quotation_detail_id'])->update(['supplier_id' => $detail['vendor_id']]);
				if($detail['vendor_rate']){
					
				}
				}
			}

			VendorQuotationDetail::insert($data);  // Bulk insert

			DB::commit();

			return $this->jsonResponse(['quotation_id' => $quotation_id], 200, 'Quotation Vendors Saved Successfully!');
		} catch (\Exception $e) {
			DB::rollBack();
			return $this->jsonResponse(['error' => $e->getMessage()], 500, 'Failed to save vendor quotations.');
		}
	}

	public function vendorUpdate($id, Request $request)
	{
		$isError = $this->validateStoreRequest($request->all());
		if (!empty($isError)) {
			return $this->jsonResponse($isError, 400, 'Request Failed!');
		}

		DB::beginTransaction();

		try {
			$data = VendorQuotationDetail::where('quotation_id', $id)
				->where('quotation_detail_id', $request->quotation_detail_id)
				->where('vendor_id', $request->vendor_id)
				->first();

			$data->vendor_rate = $request->vendor_rate ?? '';
			$data->vendor_part_no = $request->vendor_part_no ?? '';
			$data->vendor_notes = $request->vendor_notes ?? '';
			$data->updated_at = Carbon::now();
			$data->updated_by = $request->vendor_id;
			$data->update();

			DB::commit();

			return $this->jsonResponse(['quotation_id' => $id], 200, 'Quotation Vendor Details Updated Successfully!');
		} catch (\Exception $e) {
			DB::rollBack();
			return $this->jsonResponse(['error' => $e->getMessage()], 500, 'Failed to update vendor quotations.');
		}
	}
}
