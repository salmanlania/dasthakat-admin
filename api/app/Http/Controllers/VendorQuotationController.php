<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use App\Models\Product;
use App\Models\ProductType;
use App\Models\Quotation;
use App\Models\QuotationCommissionAgent;
use App\Models\QuotationDetail;
use App\Models\Supplier;
use App\Models\Unit;
use App\Models\VendorPlatform\VpQuotationRfq;
use App\Models\VendorPlatform\VpQuotationRfqDetail;
use App\Models\VendorQuotationDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class VendorQuotationController extends Controller
{

    protected $document_type_id = 56; // Assuming this is the document type ID for Vendor Quotation RFQ

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
            // Validate quotation details
            if (empty($data['quotation_detail']) || !is_array($data['quotation_detail'])) {
                throw new \InvalidArgumentException('Invalid quotation details provided');
            }

            // Fetch quotation with minimal data
            $data['quotation'] = Quotation::with('event:event_id,event_no,event_code', 'vessel:vessel_id,name')
                ->where('quotation_id', $data['quotation_id'])
                ->select('quotation_id', 'document_identity', 'document_date', 'event_id', 'vessel_id')
                ->firstOrFail();


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
                    $errors[] = "Error processing detail ID " . $detail['quotation_detail_id'] || "known" . ": " . $e->getMessage();
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
                            $quotationItem = VendorQuotationDetail::join('quotation_detail as qd', 'qd.quotation_detail_id', '=', 'vendor_quotation_detail.quotation_detail_id')->where('qd.quotation_detail_id', $row['quotation_detail_id'])
                                ->where('vendor_id', $vendor_id)
                                ->select('vendor_quotation_detail.vendor_quotation_detail_id', 'qd.product_name', 'qd.quotation_detail_id', 'qd.product_id', 'qd.product_type_id', 'qd.unit_id', 'vendor_quotation_detail.vendor_part_no')
                                ->first();

                            $quotationItem->product = Product::where('product_id', $quotationItem->product_id)->select("*", DB::raw("CONCAT(impa_code, ' ', name) as product_name"))->first();
                            $quotationItem->product_type = ProductType::where('product_type_id', $quotationItem->product_type_id)->select("*")->first();
                            $quotationItem->unit = Unit::where('unit_id', $quotationItem->unit_id)->select("*")->first();
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
                    $data['quotation_detail'] = $quotationDetail;
                    $data['vendor_id'] = $vendor_id;
                    $id = $this->saveRFQ($data);

                    $link = env("VENDOR_URL") . "quotation/{$id}";
                    // $transform = [
                    //     'quotation' => $data['quotation'],
                    //     'quotation_detail' => $quotationDetail,
                    //     'vendor' => $vendor,
                    // ];

                    // $jsonData = json_encode($transform);
                    // $encoded = rtrim(strtr(base64_encode($jsonData), '+/', '-_'), '=');
                    // $transform['link'] = env("VENDOR_URL") . "quotation?q={$encoded}";

                    $payload = [
                        'template' => 'vendor_quotation_rate_update',
                        'data' => [
                            'link' => $link,
                            'quotation_no' => $data['quotation']->document_identity,
                            'date_required' => Carbon::parse($data['date_required'])->format('d M Y'),
                        ],
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

    public function saveRFQ($data)
    {
        $quotation_id = $data['quotation_id'];
        $vendor_id = $data['vendor_id'];
        $quotationDetail = $data['quotation_detail'];
        if (empty($quotation_id) || empty($vendor_id) || empty($quotationDetail)) {
            throw new \InvalidArgumentException('Quotation ID, Vendor ID, and Quotation Details are required');
        }
        $id = $this->get_uuid();
        $document = DocumentType::getNextDocument($this->document_type_id, $data);

        VpQuotationRfq::insert([
            'id' => $id,
            'company_id' => $data['company_id'] ?? null,
            'company_branch_id' => $data['company_branch_id'] ?? null,
            'document_type_id' => $document['document_type_id'] ?? null,
            'document_no' => $document['document_no'] ?? null,
            'document_prefix' => $document['document_prefix'] ?? null,
            'document_identity' => $document['document_identity'] ?? null,
            'quotation_id' => $quotation_id,
            'vendor_id' => $vendor_id,
            'total_items' => count($quotationDetail),
            'items_quoted' => 0, // Initially set to 0, will be updated later
            'date_required' => $data['date_required'],
            'date_sent' => Carbon::now(),
            'date_returned' => null,
            'created_by' => $data['created_by_user'] ?? null,
            'created_at' => Carbon::now(),
        ]);
        $detail = [];
        foreach ($quotationDetail as $item) {
            $detail[] = [
                'detail_id' => $this->get_uuid(),
                'id' => $id,
                'quotation_detail_id' => $item->quotation_detail_id,
                'vendor_quotation_detail_id' => $item->vendor_quotation_detail_id ?? null,
                'created_by' => $data['created_by_user'] ?? null,
                'updated_by' => $data['created_by_user'] ?? null,
            ];
        }

        if (!empty($detail)) {
            VpQuotationRfqDetail::insert($detail);
        }
        return $id;
    }

    public function fetchRFQ($id)
    {
        $rfq = VpQuotationRfq::with('quotation', 'quotation.event', 'quotation.vessel', 'vendor')
            ->where('id', $id)
            ->first();

        foreach ($rfq->details as &$detail) {
            $detail->vendor_quotation_detail = VendorQuotationDetail::with('quotation_detail', 'quotation_detail.product_type', 'quotation_detail.product', 'quotation_detail.unit')
                ->where('vendor_quotation_detail_id', $detail->vendor_quotation_detail_id)
                ->first();
        }

        if (!$rfq) {
            return $this->jsonResponse([], 404, 'RFQ Not Found!');
        }
        if (Carbon::parse($rfq->date_required)->lt(Carbon::now()->toDateString())) {
            return $this->jsonResponse([], 400, 'RFQ has expired!');
        }

        return $this->jsonResponse($rfq, 200, 'RFQ Data Fetched Successfully!');
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
            $quotation_details = $request->quotation_detail;
            foreach ($quotation_details as $row => $detail) {
                try {
                    $vendor_quotation_detail_id = $this->get_uuid();
                    $detail['vendor_quotation_detail_id'] = $vendor_quotation_detail_id;
                    $row++;
                    $data[] = [
                        'company_id' => $request->company_id ?? '',
                        'company_branch_id' => $request->company_branch_id ?? '',
                        'vendor_quotation_detail_id' => $vendor_quotation_detail_id,
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
                                $quotation_detail->vendor_part_no = $detail['vendor_part_no'] ?? '';
                                $quotation_detail->cost_price = $detail['vendor_rate'];
                                $quotation_detail->rate = $quotation_detail->cost_price + ($quotation_detail->cost_price * $quotation_detail->markup) / 100;
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
            $request->merge(['quotation_detail' => $quotation_details]);
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

            $commissionAgents = QuotationCommissionAgent::where('quotation_id', $quotation_id)
                ->get();
            foreach ($commissionAgents as $agent) {
                $agent->commission_amount = $quotation->net_amount * $agent->commission_percent / 100;
                $agent->save();
            }

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


    public function show($id)
    {
        $data = VendorQuotationDetail::with('quotation_detail', 'quotation_detail.product_type', 'quotation_detail.product', 'quotation_detail.unit', 'vendor')->where('quotation_id', $id)->orderBy('sort_order')->get();

        if (empty($data)) {
            return $this->jsonResponse([], 400, 'Quotation Item(s) Not Found!');
        }
        return $this->jsonResponse($data, 200, 'Quotation Vendor Data Fetched Successfully!');
    }

    public function vendorUpdate($id, Request $request)
    {
        $isError = $this->validateStoreRequest($request->all());
        if (!empty($isError)) {
            return $this->jsonResponse($isError, 400, 'Request Failed!');
        }

        $quotation_id = VpQuotationRfq::where('id', $id)->value('quotation_id');
        $updateQuote = false;
        $errors = [];
        DB::beginTransaction();

        try {
            foreach ($request->quotation_detail as $row) {
                try {
                    // Find or create the vendor quotation detail record
                    $data = VendorQuotationDetail::firstOrNew([
                        'quotation_id' => $quotation_id,
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
                            $quotation_detail->vendor_part_no = $row['vendor_part_no'] ?? "";
                            $quotation_detail->cost_price = $row['vendor_rate'];
                            $quotation_detail->rate = $quotation_detail->cost_price +  ($quotation_detail->cost_price * $quotation_detail->markup) / 100;
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
                $quotation = Quotation::findOrFail($quotation_id);
                $detail = QuotationDetail::where('quotation_id', $quotation_id);

                $quotation->total_cost = $detail->sum(DB::raw('cost_price * quantity'));
                $quotation->total_amount = $detail->sum('amount');
                $quotation->total_discount = $detail->sum('discount_amount');
                $quotation->net_amount = $detail->sum('gross_amount');
                $quotation->rebate_amount = $quotation->net_amount * $quotation->rebate_percent / 100;
                $quotation->salesman_amount = $quotation->net_amount * $quotation->salesman_percent / 100;

                // Fixed: Was using salesman_amount twice in calculation
                $quotation->final_amount = $quotation->net_amount - ($quotation->salesman_amount + $quotation->rebate_amount);

                $quotation->save();

                $commissionAgents = QuotationCommissionAgent::where('quotation_id', $quotation_id)
                    ->get();
                foreach ($commissionAgents as $agent) {
                    $agent->commission_amount = $quotation->net_amount * $agent->commission_percent / 100;
                    $agent->save();
                }
            }


            $count = VendorQuotationDetail::where('quotation_id', $quotation_id)
                ->where('quotation_detail_id', $row['quotation_detail_id'])
                ->where('vendor_id', $request->vendor_id)
                ->whereNotNull('vendor_rate')
                ->count();
            VpQuotationRfq::where('id', $id)
                ->update(['items_quoted' => $count, 'date_returned' => Carbon::now()]);

            DB::commit();

            $response = ['quotation_id' => $quotation_id];
            if (!empty($errors)) {
                $response['warnings'] = $errors;
                return $this->jsonResponse($response, 200, 'Updated with some warnings');
            }

            return $this->jsonResponse($response, 200, 'Quotation Vendor Details Updated Successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Vendor Update Error: ' . $e->getMessage(), [
                'quotation_id' => $quotation_id,
                'vendor_id' => $request->vendor_id ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            return $this->jsonResponse(['error' => $e->getMessage()], 500, 'Failed to update vendor quotations.');
        }
    }
}
