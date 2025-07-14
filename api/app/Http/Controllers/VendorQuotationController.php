<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\QuotationDetail;
use App\Models\Supplier;
use App\Models\VendorQuotationDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
			'quotation_detail.*.quotation_detail_id' => ['required'],
		];

		$validator = Validator::make($request, $rules);
		if ($validator->fails()) {
			$firstError = $validator->errors()->first();
			return $firstError;
		}
		return [];
	}

public function sendRFQ($data)
{
    try {
        // Validate required data
        if (empty($data['quotation_id'])) {
            throw new \InvalidArgumentException('Quotation ID is required');
        }

        // Fetch quotation with minimal data
        $data['quotation'] = Quotation::with('event:event_id,event_no,event_code', 'vessel:vessel_id,name')
            ->where('quotation_id', $data['quotation_id'])
            ->select('quotation_id', 'document_identity', 'document_date', 'event_id', 'vessel_id')
            ->firstOrFail();

        // Validate quotation details
        if (empty($data['quotation_detail']) || !is_array($data['quotation_detail'])) {
            throw new \InvalidArgumentException('Invalid quotation details provided');
        }

        $rfqQuotations = [];
        $errors = [];
        $successCount = 0;

        // Group details by vendor
        foreach ($data['quotation_detail'] as $detail) {
            try {
                if (($detail['rfq'] ?? 0) == 1 && !empty($detail['vendor_id'])) {
                    if (!isset($rfqQuotations[$detail['vendor_id']])) {
                        $rfqQuotations[$detail['vendor_id']] = [];
                    }
                    $rfqQuotations[$detail['vendor_id']][] = $detail;
                }
            } catch (\Exception $e) {
                $errors[] = "Error processing detail ID " . $detail['quotation_detail_id'] || "known". ": " . $e->getMessage();
            }
        }

        // Process each vendor's RFQ
        foreach ($rfqQuotations as $vendor_id => $details) {
            try {
                $quotationDetail = [];
                $vendor = Supplier::where('supplier_id', $vendor_id)
                    ->select('supplier_id', 'name', 'email')
                    ->first();

                if (!$vendor) {
                    throw new \RuntimeException("Vendor ID {$vendor_id} not found");
                }

                foreach ($details as $row) {
                    try {
                        $quotationItem = QuotationDetail::with('product:product_id,impa_code,name,short_code,product_code', 'product_type:product_type_id,name', 'unit:unit_id,name')
                            ->where('quotation_id', $data['quotation_id'])
                            ->where('quotation_detail_id', $row['quotation_detail_id'])
                            // ->where('supplier_id', $vendor_id)
                            ->select('product_name', 'quotation_detail_id', 'product_id', 'product_type_id', 'unit_id', 'vendor_part_no')
                            ->first();

                        if (!$quotationItem) {
                            throw new \RuntimeException("Quotation detail not found for ID {$row['quotation_detail_id']}");
                        }

                        $vendor_item = VendorQuotationDetail::where('quotation_id', $data['quotation_id'])
                            ->where('quotation_detail_id', $row['quotation_detail_id'])
                            ->where('vendor_id', $vendor_id)
                            ->select('vendor_rate')
                            ->first();

                        if (!$vendor_item) {
                            throw new \RuntimeException("Vendor quotation detail not found for ID {$row['quotation_detail_id']}");
                        }

                        $quotationItem->vendor_rate = $vendor_item->vendor_rate;
                        $quotationDetail[] = $quotationItem;
                    } catch (\Exception $e) {
                        $errors[] = "Error processing item {$row['quotation_detail_id']} for vendor {$vendor_id}: " . $e->getMessage();
                        continue;
                    }
                }

                if (empty($quotationDetail)) {
                    throw new \RuntimeException("No valid quotation items found for vendor {$vendor_id}");
                }

                $transform = [
                    'quotation' => $data['quotation'],
                    'quotation_detail' => $quotationDetail,
                    'vendor' => $vendor,
                ];

                $jsonData = json_encode($transform);
                $encoded = rtrim(strtr(base64_encode($jsonData), '+/', '-_'), '=');
                $transform['link'] = env("VENDOR_URL") . "quotation?q={$encoded}";

                $payload = [
                    'template' => 'vendor_quotation_rate_update',
                    'data' => $transform,
                    'email' => $vendor->email,
                    'name' => $vendor->name,
                    'subject' => 'New Request Quotation ' . $data['quotation']->document_identity,
                    'message' => '',
                ];

                $this->sendEmail($payload);
                $successCount++;
            } catch (\Exception $e) {
                $errors[] = "Error sending RFQ to vendor {$vendor_id}: " . $e->getMessage();
                continue;
            }
        }

        if ($successCount === 0 && !empty($errors)) {
            throw new \RuntimeException("Failed to send any RFQs. Errors: " . implode('; ', $errors));
        }

        return [
            'success' => true,
            'sent_count' => $successCount,
            'errors' => $errors
        ];

    } catch (\Exception $e) {
        Log::error('RFQ Processing Error: ' . $e->getMessage(), [
            'quotation_id' => $data['quotation_id'] ?? null,
            'trace' => $e->getTraceAsString()
        ]);
        throw $e;
    }
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
        
        // Validate quotation exists
        $quotation = Quotation::where('quotation_id', $quotation_id)->first();
        if (!$quotation) {
            throw new \RuntimeException("Quotation not found");
        }

        // Delete existing vendor details
        VendorQuotationDetail::where('quotation_id', $quotation_id)->delete();

        $data = [];
        $errors = [];
        $primaryVendorUpdates = 0;

        foreach ($request->quotation_detail as $row => $detail) {
            try {
                $row++;
                $data[] = [
                    'company_id' => $request->company_id ?? '',
                    'company_branch_id' => $request->company_branch_id ?? '',
                    'vendor_quotation_detail_id' => $this->get_uuid(),
                    'quotation_id' => $quotation_id,
                    'sort_order' => $row,
                    'quotation_detail_id' => $detail['quotation_detail_id'],
                    'vendor_id' => $detail['vendor_id'] ?? '',
                    'vendor_rate' => $detail['vendor_rate'] ?? 0,
                    'is_primary_vendor' => $detail['is_primary_vendor'] ?? 0,
                    'vendor_part_no' => $detail['vendor_part_no'] ?? '',
                    'vendor_notes' => $detail['vendor_notes'] ?? '',
                    'created_at' => Carbon::now(),
                    'created_by' => $request->login_user_id,
                ];

                if (!empty($detail['vendor_id'])) {
                    if ($detail['is_primary_vendor'] == 1) {
                        $quotation_detail = QuotationDetail::where('quotation_detail_id', $detail['quotation_detail_id'])
                            ->first();

                        if (!$quotation_detail) {
                            throw new \RuntimeException("Quotation detail not found for ID {$detail['quotation_detail_id']}");
                        }

                        $quotation_detail->supplier_id = $detail['vendor_id'];
                        
                        if ($detail['vendor_rate']) {
                            // $quotation_detail->markup = calculateProfitPercentage($quotation_detail->cost_price, $detail['vendor_rate']);
                            $quotation_detail->cost_price = $detail['vendor_rate'];
                            $quotation_detail->rate = ($quotation_detail->cost_price * $quotation_detail->markup) / 100;
                            $quotation_detail->amount = $quotation_detail->quantity * $quotation_detail->rate;
                            $quotation_detail->discount_amount = ($quotation_detail->amount * $quotation_detail->discount_percent) / 100;
                            $quotation_detail->gross_amount = $quotation_detail->amount - $quotation_detail->discount_amount;
                        }
                        
                        $quotation_detail->update();
                        $primaryVendorUpdates++;
                    }
                }
            } catch (\Exception $e) {
                $errors[] = "Error processing detail row {$row}: " . $e->getMessage();
                continue;
            }
        }

        if (empty($data)) {
            throw new \RuntimeException("No valid vendor quotation details to save");
        }

        VendorQuotationDetail::insert($data);

        // Recalculate quotation totals
        $detail = QuotationDetail::where('quotation_id', $quotation_id);
        $quotation->total_cost = $detail->sum(DB::raw('cost_price * quantity'));
        $quotation->total_amount = $detail->sum('amount');
        $quotation->total_discount = $detail->sum('discount_amount');
        $quotation->net_amount = $detail->sum('gross_amount');
        $quotation->rebate_amount = $quotation->net_amount * $quotation->rebate_percent / 100;
        $quotation->salesman_amount = $quotation->net_amount * $quotation->salesman_percent / 100;
        $quotation->final_amount = $quotation->net_amount - ($quotation->salesman_amount + $quotation->rebate_amount);
        $quotation->update();

        DB::commit();

        // Send RFQs if no critical errors
        if (empty($errors)) {
            try {
                $rfqResult = $this->sendRFQ($request);
                if (!empty($rfqResult['errors'])) {
                    $errors = array_merge($errors, $rfqResult['errors']);
                }
            } catch (\Exception $e) {
                $errors[] = "RFQ sending failed: " . $e->getMessage();
            }
        }

        $response = ['quotation_id' => $quotation_id];
        if (!empty($errors)) {
            $response['warnings'] = $errors;
            return $this->jsonResponse($response, 200, 'Quotation Vendors Saved with some warnings');
        }

        return $this->jsonResponse($response, 200, 'Quotation Vendors Saved Successfully!');

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Quotation Vendor Store Error: ' . $e->getMessage(), [
            'quotation_id' => $quotation_id ?? null,
            'trace' => $e->getTraceAsString()
        ]);
        return $this->jsonResponse(['error' => $e->getMessage()], 500, 'Failed to save vendor quotations.');
    }
}

	// function sendRFQ($data)
	// {
	// 	$data['quotation'] = Quotation::with('event:event_id,event_no,event_code', 'vessel:vessel_id,name')
	// 		->where('quotation_id', $data['quotation_id'])
	// 		->select('quotation_id', 'document_identity', 'document_date', 'event_id', 'vessel_id')
	// 		->first();

	// 	$rfqQuotations = [];
	// 	foreach ($data['quotation_detail'] as $detail) {
	// 		if (($detail['rfq'] ?? 0) == 1 && !empty($detail['vendor_id'])) {
	// 			if (!isset($rfqQuotations[$detail['vendor_id']])) {
	// 				$rfqQuotations[$detail['vendor_id']] = [];
	// 			}
	// 			$rfqQuotations[$detail['vendor_id']][] = $detail;
	// 		}
	// 	}

	// 	foreach ($rfqQuotations as $vendor_id => $detail) {
	// 		$quotationDetail = [];
	// 		foreach ($detail as $row) {
	// 			$quotationItem = QuotationDetail::with('product:product_id,impa_code,name,short_code,product_code', 'product_type:product_type_id,name', 'unit:unit_id,name')
	// 				->where('quotation_id', $data['quotation_id'])
	// 				->where('quotation_detail_id', $row['quotation_detail_id'])
	// 				->where('supplier_id', $vendor_id)
	// 				->select('product_name', 'quotation_detail_id', 'product_id', 'product_type_id', 'unit_id', 'vendor_part_no')
	// 				->first();
	// 			$vendor_item = VendorQuotationDetail::where('quotation_id', $data['quotation_id'])
	// 				->where('quotation_detail_id', $row['quotation_detail_id'])
	// 				->where('vendor_id', $vendor_id)
	// 				->select('vendor_rate')
	// 				->first();
	// 			if ($quotationItem && $vendor_item) {
	// 				$quotationItem->vendor_rate = $vendor_item->vendor_rate;
	// 				$quotationDetail[] = $quotationItem;
	// 			}
	// 		}

	// 		$vendor = Supplier::where('supplier_id', $vendor_id)
	// 			->select('supplier_id', 'name', 'email')
	// 			->first();
	// 		$transform = [
	// 			'quotation' => $data['quotation'],
	// 			'quotation_detail' => $quotationDetail,
	// 			'vendor' => $vendor,
	// 		];
	// 		$jsonData = json_encode($transform);
	// 		$encoded = rtrim(strtr(base64_encode($jsonData), '+/', '-_'), '=');
	// 		$transform['link'] = "http://localhost:5173/vendor-platform/quotation?q={$encoded}";
	// 		// dd($transform['vendor']);
	// 		$payload = [
	// 			'template' => 'vendor_quotation_rate_update',
	// 			'data' => $transform,
	// 			'email' => $transform['vendor']['email'],
	// 			'name' => $transform['vendor']['name'],
	// 			'subject' => 'New Request Quotation ' . $transform['quotation']->document_identity,
	// 			'message' => '',
	// 		];

	// 		try {
	// 			$this->sendEmail($payload);
	// 		} catch (\Exception $e) {
	// 			Log::error('Quotation Store Error: ' . $e->getMessage());
	// 			throw $this->jsonResponse([], 400, 'RFQ Sent Failed!' . $e->getMessage());
	// 		}
	// 	}
	// }

	public function show($id)
	{
		$data = VendorQuotationDetail::with('quotation_detail', 'quotation_detail.product_type', 'quotation_detail.product', 'quotation_detail.unit', 'vendor')->where('quotation_id', $id)->orderBy('sort_order')->get();

		if (empty($data)) {
			return $this->jsonResponse([], 400, 'Quotation Item(s) Not Found!');
		}
		return $this->jsonResponse($data, 200, 'Quotation Vendor Data Fetched Successfully!');
	}

	// public function store(Request $request)
	// {
	// 	$isError = $this->validateStoreRequest($request->all());
	// 	if (!empty($isError)) {
	// 		return $this->jsonResponse($isError, 400, 'Request Failed!');
	// 	}

	// 	DB::beginTransaction();
	// 	try {
	// 		$quotation_id = $request->quotation_id;
	// 		VendorQuotationDetail::where('quotation_id', $quotation_id)->delete();
	// 		$data = [];
	// 		foreach ($request->quotation_detail as $row => $detail) {
	// 			$row++;
	// 			$data[] = [
	// 				'company_id' => $request->company_id ?? '',
	// 				'company_branch_id' => $request->company_branch_id ?? '',
	// 				'vendor_quotation_detail_id' => $this->get_uuid(),
	// 				'quotation_id' => $quotation_id ?? '',
	// 				'sort_order' => $row,
	// 				'quotation_detail_id' => $detail['quotation_detail_id'],
	// 				'vendor_id' => $detail['vendor_id'] ?? '',
	// 				'vendor_rate' => $detail['vendor_rate'] ?? '',
	// 				'is_primary_vendor' => $detail['is_primary_vendor'] ?? 0,
	// 				'vendor_part_no' => $detail['vendor_part_no'] ?? '',
	// 				'vendor_notes' => $detail['vendor_notes'] ?? '',
	// 				'created_at' => Carbon::now(),
	// 				'created_by' => $request->login_user_id,
	// 			];
	// 			if (!empty($detail['vendor_id'])) {
	// 				if ($detail['is_primary_vendor'] == 1) {
	// 					$quotation_detail = QuotationDetail::where('quotation_detail_id', $detail['quotation_detail_id'])->first();
	// 					$quotation_detail->supplier_id = $detail['vendor_id'];
	// 					if ($detail['vendor_rate']) {
	// 						$quotation_detail->markup = calculateProfitPercentage($quotation_detail->cost_price, $detail['vendor_rate']);
	// 						$quotation_detail->rate = $detail['vendor_rate'];
	// 						$quotation_detail->amount = $quotation_detail->quantity * $detail['vendor_rate'];
	// 						$quotation_detail->discount_amount = ($quotation_detail->amount * $quotation_detail->discount_percent) / 100;
	// 						$quotation_detail->gross_amount = $quotation_detail->amount - $quotation_detail->discount_amount;
	// 					}
	// 					$quotation_detail->update();
	// 				}
	// 			}
	// 		}
	// 		VendorQuotationDetail::insert($data);  // Bulk insert

	// 		$quotation = Quotation::where('quotation_id', $quotation_id)->first();
	// 		$detail = QuotationDetail::where('quotation_id', $quotation_id);
	// 		$quotation->total_amount = $detail->sum('amount');
	// 		$quotation->total_discount = $detail->sum('discount_amount');
	// 		$quotation->net_amount = $detail->sum('gross_amount');
	// 		$quotation->rebate_amount = $quotation->net_amount * $quotation->rebate_percent / 100;
	// 		$quotation->salesman_amount = $quotation->net_amount * $quotation->salesman_percent / 100;
	// 		$quotation->final_amount = $quotation->net_amount - ($quotation->salesman_amount + $quotation->rebate_amount);
	// 		$quotation->update();

	// 		DB::commit();

	// 		try {
	// 			$this->sendRFQ($request);
	// 		} catch (\Exception $e) {
	// 			return $this->jsonResponse([], 400, 'RFQ Sent Failed!' . $e->getMessage());
	// 		}
	// 		return $this->jsonResponse(['quotation_id' => $quotation_id], 200, 'Quotation Vendors Saved Successfully!');
	// 	} catch (\Exception $e) {
	// 		DB::rollBack();
	// 		return $this->jsonResponse(['error' => $e->getMessage()], 500, 'Failed to save vendor quotations.');
	// 	}
	// }

	// public function vendorUpdate($id, Request $request)
	// {
	// 	$isError = $this->validateStoreRequest($request->all());
	// 	if (!empty($isError)) {
	// 		return $this->jsonResponse($isError, 400, 'Request Failed!');
	// 	}

	// 	$updateQuote = false;  
	// 	DB::beginTransaction();
	// 	try {
	// 		foreach ($request->quotation_detail as $row) {
	// 			$data = VendorQuotationDetail::where('quotation_id', $id)
	// 				->where('quotation_detail_id', $row['quotation_detail_id'])
	// 				->where('vendor_id', $request->vendor_id)
	// 				->first();

	// 			$data->vendor_rate = $row['vendor_rate'] ?? '';
	// 			$data->vendor_part_no = $row['vendor_part_no'] ?? '';
	// 			$data->vendor_notes = $row['vendor_notes'] ?? '';
	// 			$data->updated_at = Carbon::now();
	// 			$data->updated_by = $request->vendor_id;
	// 			$data->update();

	// 			$quotation_detail = QuotationDetail::where('quotation_detail_id', $row['quotation_detail_id'])->first();

	// 			if ($row['vendor_rate'] && $data->is_primary_vendor == 1) {
	// 				$updateQuote = true;
	// 				$quotation_detail->markup = calculateProfitPercentage($quotation_detail->cost_price, $row['vendor_rate']);
	// 				$quotation_detail->rate = $row['vendor_rate'];
	// 				$quotation_detail->amount = $quotation_detail->quantity * $row['vendor_rate'];
	// 				$quotation_detail->discount_amount = ($quotation_detail->amount * $quotation_detail->discount_percent) / 100;
	// 				$quotation_detail->gross_amount = $quotation_detail->amount - $quotation_detail->discount_amount;
	// 				$quotation_detail->update();
	// 			}
	// 		}
	// 		if ($updateQuote) {
	// 			$quotation = Quotation::where('quotation_id', $id)->first();
	// 			$detail = QuotationDetail::where('quotation_id', $id);
	// 			$quotation->total_amount = $detail->sum('amount');
	// 			$quotation->total_discount = $detail->sum('discount_amount');
	// 			$quotation->net_amount = $detail->sum('gross_amount');
	// 			$quotation->rebate_amount = $quotation->net_amount * $quotation->rebate_percent / 100;
	// 			$quotation->salesman_amount = $quotation->net_amount * $quotation->salesman_percent / 100;
	// 			$quotation->final_amount = $quotation->net_amount - ($quotation->salesman_amount + $quotation->salesman_amount);
	// 			$quotation->update();
	// 		}

	// 		DB::commit();

	// 		return $this->jsonResponse(['quotation_id' => $id], 200, 'Quotation Vendor Details Updated Successfully!');
	// 	} catch (\Exception $e) {
	// 		DB::rollBack();
	// 		return $this->jsonResponse(['error' => $e->getMessage()], 500, 'Failed to update vendor quotations.');
	// 	}
	// }
	public function vendorUpdate($id, Request $request)
{
    $isError = $this->validateStoreRequest($request->all());
    if (!empty($isError)) {
        return $this->jsonResponse($isError, 400, 'Request Failed!');
    }

    $updateQuote = false;
    $errors = [];
    DB::beginTransaction();
    
    try {
        foreach ($request->quotation_detail as $row) {
            try {
                // Find or create the vendor quotation detail record
                $data = VendorQuotationDetail::firstOrNew([
                    'quotation_id' => $id,
                    'quotation_detail_id' => $row['quotation_detail_id'],
                    'vendor_id' => $request->vendor_id
                ]);

                // Set the fields with proper null checks
                $data->vendor_rate = $row['vendor_rate'] ?? null;
                $data->vendor_part_no = $row['vendor_part_no'] ?? null;
                $data->vendor_notes = $row['vendor_notes'] ?? null;
                $data->updated_at = Carbon::now();
                $data->updated_by = $request->vendor_id;
                $data->save();

                // Update quotation detail if this is primary vendor
                if (!empty($row['vendor_rate'])) {
                    $quotation_detail = QuotationDetail::where('quotation_detail_id', $row['quotation_detail_id'])
                        ->first();

                    if (!$quotation_detail) {
                        throw new \Exception("Quotation detail not found for ID: {$row['quotation_detail_id']}");
                    }

                    if ($data->is_primary_vendor == 1) {
                        $updateQuote = true;
                        // $quotation_detail->markup = calculateProfitPercentage(
                        //     $quotation_detail->cost_price, 
                        //     $row['vendor_rate']
                        // );
                        $quotation_detail->vendor_part_no = $row['vendor_part_no'] ?? "";
                        $quotation_detail->cost_price = $row['vendor_rate'];
                        $quotation_detail->rate = ($quotation_detail->cost_price * $quotation_detail->markup) / 100;
                        $quotation_detail->amount = $quotation_detail->quantity * $row['vendor_rate'];
                        $quotation_detail->discount_amount = ($quotation_detail->amount * $quotation_detail->discount_percent) / 100;
                        $quotation_detail->gross_amount = $quotation_detail->amount - $quotation_detail->discount_amount;
                        $quotation_detail->save();
                    }
                }
            } catch (\Exception $e) {
                $errors[] = "Error processing detail {$row['quotation_detail_id']}: " . $e->getMessage();
                continue;
            }
        }

        // Update quotation totals if needed
        if ($updateQuote) {
            $quotation = Quotation::findOrFail($id);
            $detail = QuotationDetail::where('quotation_id', $id);

            $quotation->total_cost = $detail->sum(DB::raw('cost_price * quantity'));
            $quotation->total_amount = $detail->sum('amount');
            $quotation->total_discount = $detail->sum('discount_amount');
            $quotation->net_amount = $detail->sum('gross_amount');
            $quotation->rebate_amount = $quotation->net_amount * $quotation->rebate_percent / 100;
            $quotation->salesman_amount = $quotation->net_amount * $quotation->salesman_percent / 100;
            
            // Fixed: Was using salesman_amount twice in calculation
            $quotation->final_amount = $quotation->net_amount - ($quotation->salesman_amount + $quotation->rebate_amount);
            
            $quotation->save();
        }

        DB::commit();

        $response = ['quotation_id' => $id];
        if (!empty($errors)) {
            $response['warnings'] = $errors;
            return $this->jsonResponse($response, 200, 'Updated with some warnings');
        }

        return $this->jsonResponse($response, 200, 'Quotation Vendor Details Updated Successfully!');
        
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Vendor Update Error: ' . $e->getMessage(), [
            'quotation_id' => $id,
            'vendor_id' => $request->vendor_id ?? null,
            'trace' => $e->getTraceAsString()
        ]);
        return $this->jsonResponse(['error' => $e->getMessage()], 500, 'Failed to update vendor quotations.');
    }
}
}
