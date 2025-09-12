<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\ChargeOrderCommissionAgent;
use App\Models\ChargeOrderDetail;
use App\Models\DocumentType;
use App\Models\Product;
use App\Models\ProductType;
use App\Models\Supplier;
use App\Models\Unit;
use App\Models\VendorChargeOrderDetail;
use App\Models\ChargeOrderVendorRateHistory;
use App\Models\VendorPlatform\VpChargeOrderRfq;
use App\Models\VendorPlatform\VpChargeOrderRfqDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class VendorChargeOrderController extends Controller
{

    protected $document_type_id = 57; // Assuming this is the document type ID for Vendor Charge Order RFQ

    /**
     * Get last valid vendor rate for a vendor by product key
     * Uses product_id for IMPA items, otherwise product_name for other items
     */

    public function validateRequest($request)
    {
        $rules = [
            'vendor_id' => ['required'],
            'charge_order_id' => ['required'],
            'charge_order_detail_id' => ['required'],
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
            'charge_order_id' => ['required'],
            'charge_order_detail' => ['required', 'array'],
            'charge_order_detail.*.charge_order_detail_id' => ['required'],
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
            if (empty($data['charge_order_id'])) {
                throw new \InvalidArgumentException('Charge Order ID is required');
            }
            if (empty($data['charge_order_detail']) || !is_array($data['charge_order_detail'])) {
                throw new \InvalidArgumentException('Invalid charge order details provided');
            }

            $data['charge_order'] = ChargeOrder::with('event:event_id,event_no,event_code', 'vessel:vessel_id,name')
                ->where('charge_order_id', $data['charge_order_id'])
                ->select('charge_order_id', 'document_identity', 'document_date', 'event_id', 'vessel_id')
                ->firstOrFail();


            $rfqChargeOrders = [];
            $errors = [];
            $successCount = 0;

            // Group details by vendor
            foreach ($data['charge_order_detail'] as $detail) {
                try {
                    if (($detail['rfq'] ?? 0) == 1 && !empty($detail['vendor_id'])) {
                        if (!isset($rfqChargeOrders[$detail['vendor_id']])) {
                            $rfqChargeOrders[$detail['vendor_id']] = [];
                        }
                        $rfqChargeOrders[$detail['vendor_id']][] = $detail;
                    }
                } catch (\Exception $e) {
                    $errors[] = "Error processing detail ID " . $detail['charge_order_detail_id'] || "known" . ": " . $e->getMessage();
                }
            }

            // Process each vendor's RFQ
            foreach ($rfqChargeOrders as $vendor_id => $details) {
                try {
                    $chargeOrderDetail = [];
                    $vendor = Supplier::where('supplier_id', $vendor_id)
                        ->select('supplier_id', 'name', 'email')
                        ->first();

                    if (!$vendor) {
                        throw new \RuntimeException("Vendor ID {$vendor_id} not found");
                    }

                    foreach ($details as $row) {
                        try {
                            $chargeOrderItem = VendorChargeOrderDetail::join('charge_order_detail as qd', 'qd.charge_order_detail_id', '=', 'vendor_charge_order_detail.charge_order_detail_id')->where('qd.charge_order_detail_id', $row['charge_order_detail_id'])
                                ->where('vendor_id', $vendor_id)
                                ->select('vendor_charge_order_detail.vendor_charge_order_detail_id', 'qd.product_name', 'qd.charge_order_detail_id', 'qd.product_id', 'qd.product_type_id', 'qd.unit_id', 'vendor_charge_order_detail.vendor_part_no')
                                ->first();

                            $chargeOrderItem->product = Product::where('product_id', $chargeOrderItem->product_id)->select("*", DB::raw("CONCAT(impa_code, ' ', name) as product_name"))->first();
                            $chargeOrderItem->product_type = ProductType::where('product_type_id', $chargeOrderItem->product_type_id)->select("*")->first();
                            $chargeOrderItem->unit = Unit::where('unit_id', $chargeOrderItem->unit_id)->select("*")->first();
                            if (!$chargeOrderItem) {
                                throw new \RuntimeException("Charge Order detail not found for ID {$row['charge_order_detail_id']}");
                            }

                            $vendor_item = VendorChargeOrderDetail::where('charge_order_id', $data['charge_order_id'])
                                ->where('charge_order_detail_id', $row['charge_order_detail_id'])
                                ->where('vendor_id', $vendor_id)
                                ->select('vendor_rate')
                                ->first();

                            if (!$vendor_item) {
                                throw new \RuntimeException("Vendor charge order detail not found for ID {$row['charge_order_detail_id']}");
                            }

                            $chargeOrderItem->vendor_rate = $vendor_item->vendor_rate;
                            $chargeOrderDetail[] = $chargeOrderItem;
                        } catch (\Exception $e) {
                            $errors[] = "Error processing item {$row['charge_order_detail_id']} for vendor {$vendor_id}: " . $e->getMessage();
                            continue;
                        }
                    }

                    if (empty($chargeOrderDetail)) {
                        throw new \RuntimeException("No valid charge order items found for vendor {$vendor_id}");
                    }
                    $data['charge_order_detail'] = $chargeOrderDetail;
                    $data['vendor_id'] = $vendor_id;
                    $id = $this->saveRFQ($data);

                    $link = env("VENDOR_URL") . "charge-order/{$id}";

                    $payload = [
                        'template' => 'vendor_charge_order_rate_update',
                        'data' => [
                            'link' => $link,
                            'charge_order_no' => $data['charge_order']->document_identity,
                            'date_required' => Carbon::parse($data['date_required'])->format('d M Y'),
                        ],
                        'email' => $vendor->email,
                        'name' => $vendor->name,
                        'subject' => 'New Request Quotation ' . $data['charge_order']->document_identity,
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
                'charge_order_id' => $data['charge_order_id'] ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function saveRFQ($data)
    {
        $charge_order_id = $data['charge_order_id'];
        $vendor_id = $data['vendor_id'];
        $chargeOrderDetail = $data['charge_order_detail'];
        if (empty($charge_order_id) || empty($vendor_id) || empty($chargeOrderDetail)) {
            throw new \InvalidArgumentException('Charge Order ID, Vendor ID, and Charge Order Details are required');
        }
        $id = $this->get_uuid();
        $document = DocumentType::getNextDocument($this->document_type_id, $data);

        VpChargeOrderRfq::insert([
            'id' => $id,
            'company_id' => $data['company_id'] ?? null,
            'company_branch_id' => $data['company_branch_id'] ?? null,
            'document_type_id' => $document['document_type_id'] ?? null,
            'document_no' => $document['document_no'] ?? null,
            'document_prefix' => $document['document_prefix'] ?? null,
            'document_identity' => $document['document_identity'] ?? null,
            'charge_order_id' => $charge_order_id,
            'vendor_id' => $vendor_id,
            'date_required' => $data['date_required'],
            'date_sent' => Carbon::now(),
            'date_returned' => null,
            'created_by' => $data['created_by_user'] ?? null,
            'created_at' => Carbon::now(),
        ]);
        $detail = [];
        $sort_order = VpChargeOrderRfqDetail::max('sort_order') ?? 0;
        foreach ($chargeOrderDetail as $item) {
            $chargeOrderDetail = ChargeOrderDetail::where('charge_order_detail_id', $item['charge_order_detail_id'])->first();
            $vChargeOrderDetail = VendorChargeOrderDetail::where('vendor_charge_order_detail_id', $item['vendor_charge_order_detail_id'])->first();
            $detail[] = [
                'detail_id' => $this->get_uuid(),
                'id' => $id,
                'charge_order_detail_id' => $item->charge_order_detail_id,
                'vendor_charge_order_detail_id' => $item->vendor_charge_order_detail_id ?? null,
                'product_id' => $chargeOrderDetail->product_id ?? null,
                'product_name' => $chargeOrderDetail->product_name ?? null,
                'product_description' => $chargeOrderDetail->product_description ?? null,
                'product_type_id' => $chargeOrderDetail->product_type_id ?? null,
                'unit_id' => $chargeOrderDetail->unit_id ?? null,
                'sort_order' => $sort_order++,
                'quantity' => $chargeOrderDetail->quantity ?? 0,
                'vendor_rate' => 0,
                'vendor_part_no' => $vChargeOrderDetail->vendor_part_no ?? null,
                'vendor_notes' => $vChargeOrderDetail->vendor_notes ?? null,
                'created_by' => $data['created_by_user'] ?? null,
                'updated_by' => $data['created_by_user'] ?? null,
            ];
        }

        if (!empty($detail)) {
            VpChargeOrderRfqDetail::insert($detail);
        }
        return $id;
    }

    public function fetchRFQ($id)
    {
        $rfq = VpChargeOrderRfq::with('charge_order', 'charge_order.event', 'charge_order.vessel', 'vendor')
            ->where('id', $id)
            ->first();

        foreach ($rfq->details as &$detail) {
            $detail->vendor_charge_order_detail = VendorChargeOrderDetail::with('charge_order_detail', 'charge_order_detail.product_type', 'charge_order_detail.product', 'charge_order_detail.unit')
                ->where('vendor_charge_order_detail_id', $detail->vendor_charge_order_detail_id)
                ->first();


            if (!isset($detail->charge_order_detail) || empty($detail->charge_order_detail)) {
                $detail->load('product_type', 'product', 'unit');
                $detail->is_deleted = true;
            } else {
                $detail->is_deleted = false;
            }
        }
        if (!$rfq) {
            return $this->jsonResponse([], 404, 'RFQ Not Found!');
        }
        return $this->jsonResponse($rfq, 200, 'RFQ Data Fetched Successfully!');
    }


    public function store(Request $request)
    {
        if (!isPermission('add', 'vp_charge_order', $request->permission_list)) {
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");
        }
        $isError = $this->validateStoreRequest($request->all());
        if (!empty($isError)) {
            return $this->jsonResponse($isError, 400, 'Request Failed!');
        }

        DB::beginTransaction();
        try {
            $charge_order_id = $request->charge_order_id;

            $charge_order = ChargeOrder::where('charge_order_id', $charge_order_id)->first();
            if (!$charge_order) {
                throw new \RuntimeException("Charge Order not found");
            }

            $insertData = [];
            $updateData = [];
            $errors = [];
            $primaryVendorUpdates = 0;
            $charge_order_details = $request->charge_order_detail;

            foreach ($charge_order_details as $row => $detail) {
                try {
                    $row++;
                    $vendor_charge_order_detail_id = !empty($detail['vendor_charge_order_detail_id']) ? $detail['vendor_charge_order_detail_id'] : $this->get_uuid();

                    // Prepare common data for insert or update
                    $recordData = [
                        'company_id' => $request->company_id ?? '',
                        'company_branch_id' => $request->company_branch_id ?? '',
                        'vendor_charge_order_detail_id' => $vendor_charge_order_detail_id,
                        'charge_order_id' => $charge_order_id,
                        'sort_order' => $row,
                        'charge_order_detail_id' => $detail['charge_order_detail_id'],
                        'vendor_id' => $detail['vendor_id'] ?? '',
                        'vendor_rate' => $detail['vendor_rate'] ?? 0,
                        'is_primary_vendor' => $detail['is_primary_vendor'] ?? 0,
                        'vendor_part_no' => $detail['vendor_part_no'] ?? '',
                        'vendor_notes' => $detail['vendor_notes'] ?? '',
                        'updated_at' => Carbon::now(),
                        'updated_by' => $request->login_user_id,
                    ];

                    $existingRecord = VendorChargeOrderDetail::where('vendor_charge_order_detail_id', $vendor_charge_order_detail_id)->first();

                    if ($existingRecord) {
                        // Update existing record
                        $recordData['updated_at'] = Carbon::now();
                        $recordData['updated_by'] = $request->login_user_id;
                        $updateData[] = $recordData;
                        $existingRecord->update($recordData);
                    } else {
                        // Insert new record
                        $recordData['created_at'] = Carbon::now();
                        $recordData['created_by'] = $request->login_user_id;
                        $insertData[] = $recordData;
                    }

                    // Handle primary vendor logic
                    if (!empty($detail['vendor_id']) && $detail['is_primary_vendor'] == 1) {
                        $charge_order_detail = ChargeOrderDetail::where('charge_order_detail_id', $detail['charge_order_detail_id'])->first();

                        if (!$charge_order_detail) {
                            throw new \RuntimeException("Charge Order detail not found for ID {$detail['charge_order_detail_id']}");
                        }

                        $charge_order_detail->supplier_id = $detail['vendor_id'];

                        if ($detail['vendor_rate']) {
                            $charge_order_detail->vendor_part_no = $detail['vendor_part_no'] ?? '';
                            $charge_order_detail->cost_price = $detail['vendor_rate'];
                            $charge_order_detail->rate = $charge_order_detail->cost_price + ($charge_order_detail->cost_price * $charge_order_detail->markup) / 100;
                            $charge_order_detail->amount = $charge_order_detail->quantity * $charge_order_detail->rate;
                            $charge_order_detail->discount_amount = ($charge_order_detail->amount * $charge_order_detail->discount_percent) / 100;
                            $charge_order_detail->gross_amount = $charge_order_detail->amount - $charge_order_detail->discount_amount;
                        }

                        $charge_order_detail->update();
                        $primaryVendorUpdates++;
                    }
                } catch (\Exception $e) {
                    $errors[] = "Error processing detail row {$row}: " . $e->getMessage();
                    continue;
                }
            }

            // Perform bulk insert for new records
            if (!empty($insertData)) {
                VendorChargeOrderDetail::insert($insertData);
            }

            $detail = ChargeOrderDetail::where('charge_order_id', $charge_order_id);
            $charge_order->total_cost = $detail->sum(DB::raw('cost_price * quantity'));
            $charge_order->total_amount = $detail->sum('amount');
            $charge_order->discount_amount = $detail->sum('discount_amount');
            $charge_order->net_amount = $detail->sum('gross_amount');
            $charge_order->rebate_amount = $charge_order->net_amount * $charge_order->rebate_percent / 100;
            $charge_order->salesman_amount = $charge_order->net_amount * $charge_order->salesman_percent / 100;
            $charge_order->final_amount = $charge_order->net_amount - ($charge_order->salesman_amount + $charge_order->rebate_amount);
            $charge_order->update();

            // Update commission agents
            $commissionAgents = ChargeOrderCommissionAgent::where('charge_order_id', $charge_order_id)->get();
            foreach ($commissionAgents as $agent) {
                $agent->amount = $charge_order->net_amount * $agent->commission_percent / 100;
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

            $response = ['charge_order_id' => $charge_order_id, 'inserted_count' => count($insertData), 'updated_count' => count($updateData)];
            if (!empty($errors)) {
                $response['warnings'] = $errors;
                return $this->jsonResponse($response, 200, 'Charge Order Vendors Saved with some warnings');
            }

            return $this->jsonResponse($response, 200, 'Charge Order Vendors Saved Successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Charge Order Vendor Store Error: ' . $e->getMessage(), [
                'charge_order_id' => $charge_order_id ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            return $this->jsonResponse(['error' => $e->getMessage()], 500, 'Failed to save vendor charge order.');
        }
    }

    public function show($id)
    {
        $data = VendorChargeOrderDetail::with('charge_order_detail', 'charge_order_detail.product_type', 'charge_order_detail.product', 'charge_order_detail.unit', 'vendor')->where('charge_order_id', $id)->orderBy('sort_order')->get();

        if (empty($data)) {
            return $this->jsonResponse([], 400, 'Charge Order Item(s) Not Found!');
        }

        foreach ($data as $item) {
            $rfq_responded = VpChargeOrderRfqDetail::where('vendor_charge_order_detail_id', $item->vendor_charge_order_detail_id)->first();
            if ((float)$rfq_responded->vendor_rate > 0) {
                $item->rfq_responded = true;
            } else {
                $item->rfq_responded = false;
            }
            // Fallback: if vendor_rate is null/empty/zero, use last valid rate from history
            $currentRate = (float)($item->vendor_rate ?? 0);
            if ($currentRate <= 0) {
                $productId = $item->charge_order_detail->product_id ?? null;
                $productName = $item->charge_order_detail->product_name ?? null;
                $lastRate = ChargeOrderVendorRateHistory::getLastValidRate($item->vendor_id, $productId, $productName);
                if (!is_null($lastRate)) {
                    $item->vendor_rate = $lastRate;
                }
            }
        }
        return $this->jsonResponse($data, 200, 'Charge Order Vendor Data Fetched Successfully!');
    }

    public function vendorUpdate($id, Request $request)
    {
        $isError = $this->validateStoreRequest($request->all());
        if (!empty($isError)) {
            return $this->jsonResponse($isError, 400, 'Request Failed!');
        }

        $charge_order_id = VpChargeOrderRfq::where('id', $id)->value('charge_order_id');
        $updateCharge = false;
        $errors = [];
        DB::beginTransaction();

        try {
            foreach ($request->charge_order_detail as $row) {
                try {
                    $data = VendorChargeOrderDetail::firstOrNew([
                        'charge_order_id' => $charge_order_id,
                        'charge_order_detail_id' => $row['charge_order_detail_id'],
                        'vendor_id' => $request->vendor_id
                    ]);

                    // Set the fields with proper null checks
                    $data->vendor_rate = $row['vendor_rate'] ?? null;
                    $data->vendor_part_no = $row['vendor_part_no'] ?? null;
                    $data->vendor_notes = $row['vendor_notes'] ?? null;
                    $data->updated_at = Carbon::now();
                    $data->updated_by = $request->vendor_id;
                    $data->save();
                    if (isset($row['detail_id'])) {
                        $vpCDetail = VpChargeOrderRfqDetail::where('detail_id', $row['detail_id'])->first();

                        if (!empty($vpCDetail)) {

                            $vpCDetail->vendor_rate = $row['vendor_rate'] ?? null;
                            $vpCDetail->vendor_part_no = $row['vendor_part_no'] ?? null;
                            $vpCDetail->vendor_notes = $row['vendor_notes'] ?? null;
                            $vpCDetail->save();
                        }
                    }

                    // Log vendor rate history (per detail)
                    try {
                        $historyId = $this->get_uuid();
                        $qd = isset($vpCDetail) && $vpCDetail ? ChargeOrderDetail::where('charge_order_detail_id', $vpCDetail->charge_order_detail_id)->first() : ChargeOrderDetail::where('charge_order_detail_id', $row['charge_order_detail_id'])->first();
                        ChargeOrderVendorRateHistory::insert([
                            'id' => $historyId,
                            'vp_charge_order_rfq_id' => $id,
                            'vp_charge_order_rfq_detail_id' => $row['detail_id'] ?? null,
                            'charge_order_id' => $charge_order_id,
                            'charge_order_detail_id' => $row['charge_order_detail_id'] ?? ($qd->charge_order_detail_id ?? null),
                            'product_id' => $qd->product_id ?? null,
                            'product_name' => $qd->product_name ?? null,
                            'product_description' => $qd->product_description ?? null,
                            'vendor_id' => $request->vendor_id,
                            'vendor_rate' => $row['vendor_rate'] ?? null,
                            'validity_date' => $request->validity_date ?? null,
                            'created_by' => $request->vendor_id,
                            'updated_by' => $request->vendor_id,
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                    } catch (\Exception $e) {
                        // Non-blocking history error
                        Log::warning('Rate history insert failed: ' . $e->getMessage());
                    }
                    // Update charge order detail if this is primary vendor
                    if (!empty($row['vendor_rate'])) {
                        $charge_order_detail = ChargeOrderDetail::where('charge_order_detail_id', $row['charge_order_detail_id'])
                            ->first();

                        if (!$charge_order_detail) {
                            throw new \Exception("Charge Order detail not found for ID: {$row['charge_order_detail_id']}");
                        }

                        if ($data->is_primary_vendor == 1) {
                            $updateCharge = true;
                            $charge_order_detail->vendor_part_no = $row['vendor_part_no'] ?? "";
                            $charge_order_detail->vendor_notes = $row['vendor_notes'] ?? "";
                            $charge_order_detail->cost_price = $row['vendor_rate'];
                            $charge_order_detail->rate = $charge_order_detail->cost_price +  ($charge_order_detail->cost_price * $charge_order_detail->markup) / 100;
                            $charge_order_detail->amount = $charge_order_detail->quantity * $row['vendor_rate'];
                            $charge_order_detail->discount_amount = ($charge_order_detail->amount * $charge_order_detail->discount_percent) / 100;
                            $charge_order_detail->gross_amount = $charge_order_detail->amount - $charge_order_detail->discount_amount;
                            $charge_order_detail->save();
                        }
                    }
                } catch (\Exception $e) {
                    $errors[] = "Error processing detail {$row['charge_order_detail_id']}: " . $e->getMessage();
                    continue;
                }
            }

            if ($updateCharge) {
                $charge_order = ChargeOrder::findOrFail($charge_order_id);
                $detail = ChargeOrderDetail::where('charge_order_id', $charge_order_id);

                $charge_order->total_cost = $detail->sum(DB::raw('cost_price * quantity'));
                $charge_order->total_amount = $detail->sum('amount');
                $charge_order->discount_amount = $detail->sum('discount_amount');
                $charge_order->net_amount = $detail->sum('gross_amount');
                $charge_order->rebate_amount = $charge_order->net_amount * $charge_order->rebate_percent / 100;
                $charge_order->salesman_amount = $charge_order->net_amount * $charge_order->salesman_percent / 100;

                // Fixed: Was using salesman_amount twice in calculation
                $charge_order->final_amount = $charge_order->net_amount - ($charge_order->salesman_amount + $charge_order->rebate_amount);

                $charge_order->save();

                $commissionAgents = ChargeOrderCommissionAgent::where('charge_order_id', $charge_order_id)
                    ->get();
                foreach ($commissionAgents as $agent) {
                    $agent->amount = $charge_order->net_amount * $agent->commission_percent / 100;
                    $agent->save();
                }
            }


            $count = VendorChargeOrderDetail::where('charge_order_id', $charge_order_id)
                ->where('charge_order_detail_id', $row['charge_order_detail_id'])
                ->where('vendor_id', $request->vendor_id)
                ->whereNotNull('vendor_rate')
                ->count();
            VpChargeOrderRfq::where('id', $id)
                ->update([
                    'date_returned' => Carbon::now(),
                    'vendor_ref_no' => $request->vendor_ref_no ?? null,
                    'vendor_remarks' => $request->vendor_remarks ?? null,
                    'validity_date' => $request->validity_date ?? null,
                ]);

            DB::commit();

            $response = ['charge_order_id' => $charge_order_id];
            if (!empty($errors)) {
                $response['warnings'] = $errors;
                return $this->jsonResponse($response, 200, 'Updated with some warnings');
            }

            return $this->jsonResponse($response, 200, 'Charge Order Vendor Details Updated Successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Vendor Update Error: ' . $e->getMessage(), [
                'charge_order_id' => $charge_order_id,
                'vendor_id' => $request->vendor_id ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            return $this->jsonResponse(['error' => $e->getMessage()], 500, 'Failed to update charge order.');
        }
    }
}
