<?php

namespace App\Http\Controllers\VendorPlatform;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VendorPlatform\VpQuotationRfq;
use App\Models\VendorPlatform\VpQuotationRfqDetail;
use App\Models\VendorQuotationDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VpQuotationRfqController extends Controller
{
    protected $db;

  public function index(Request $request)
{
    // Request inputs
    $document_identity = $request->input('document_identity', '');
    $quotation_no = $request->input('quotation_no', '');
    $vessel_id = $request->input('vessel_id', '');
    $event_id = $request->input('event_id', '');
    $date_required = $request->input('date_required', '');
    $status = $request->input('status', '');
    $total_items = $request->input('total_items', '');
    $items_quoted = $request->input('items_quoted', '');
    $date_sent = $request->input('date_sent', '');
    $date_returned = $request->input('date_returned', '');
    $vendor_id = $request->input('vendor_id', '');
    $notification_count = $request->input('notification_count', '');
    $person_incharge_id = $request->input('person_incharge_id', '');

    $search = $request->input('search', '');
    $date_from = $request->input('date_from', '');
    $date_to = $request->input('date_to', '');

    $page = $request->input('page', 1);
    $perPage = $request->input('limit', 10);
    $sort_column = $request->input('sort_column', 'created_at');
    $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

    $currentDate = date('Y-m-d');

    // Base query with joins
    $data = VpQuotationRfq::leftJoin('quotation as q', 'q.quotation_id', '=', 'vp_quotation_rfq.quotation_id')
        ->leftJoin('vessel as v', 'v.vessel_id', '=', 'q.vessel_id')
        ->leftJoin('event as e', 'e.event_id', '=', 'q.event_id')
        ->leftJoin('supplier as s', 's.supplier_id', '=', 'vp_quotation_rfq.vendor_id')
        ->leftJoin('user as u', 'u.user_id', '=', 'q.person_incharge_id');

    // Mandatory filters
    $data = $data->where('vp_quotation_rfq.company_id', '=', $request->company_id);
    $data = $data->where('vp_quotation_rfq.company_branch_id', '=', $request->company_branch_id);

    // Apply existing filters
    if (!empty($document_identity)) {
        $data = $data->where('vp_quotation_rfq.document_identity', 'like', '%' . $document_identity . '%');
    }
    if (!empty($quotation_no)) {
        $data = $data->where('q.document_identity', 'like', '%' . $quotation_no . '%');
    }
    if (!empty($vessel_id)) {
        $data = $data->where('q.vessel_id', $vessel_id);
    }
    if(!empty($notification_count)) {
        $data = $data->where('vp_quotation_rfq.notification_count', $notification_count);
    }
    if (!empty($event_id)) {
        $data = $data->where('q.event_id', $event_id);
    }
    if (!empty($date_required)) {
        $data = $data->where('vp_quotation_rfq.date_required', $date_required);
    }
    if (!empty($date_sent)) {
        $data = $data->whereDate('vp_quotation_rfq.date_sent', $date_sent);
    }
    if (!empty($date_returned)) {
        $data = $data->whereDate('vp_quotation_rfq.date_returned', $date_returned);
    }
    if (!empty($vendor_id)) {
        $data = $data->where('vp_quotation_rfq.vendor_id', $vendor_id);
    }
    if (!empty($person_incharge_id)) {
        $data = $data->where('q.person_incharge_id', $person_incharge_id);
    }

    // Status filtering using subqueries
    if (!empty($status)) {
        if ($status == 'Cancelled') {
            $data = $data->where('vp_quotation_rfq.is_cancelled', 1);
        } elseif ($status == 'Bid Sent') {
            $data = $data->whereRaw('vp_quotation_rfq.is_cancelled = 0 AND (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != "") = 0 AND vp_quotation_rfq.date_required >= ?', [$currentDate]);
        } elseif ($status == 'Partial') {
            $data = $data->whereRaw('vp_quotation_rfq.is_cancelled = 0 AND (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != "") > 0 AND (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != "") < (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id) AND vp_quotation_rfq.date_required >= ?', [$currentDate]);
        } elseif ($status == 'Bid Received') {
            $data = $data->whereRaw('vp_quotation_rfq.is_cancelled = 0 AND (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != "") = (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id)');
        } elseif ($status == 'Bid Expired') {
            $data = $data->whereRaw('vp_quotation_rfq.date_required < ? AND (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != "") != (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id)', [$currentDate]);
        }
    }

    // Search functionality
    if (!empty($search)) {
        $search = strtolower($search);
        $data = $data->where(function ($query) use ($search) {
            $query
                ->where('vp_quotation_rfq.document_identity', 'like', '%' . $search . '%')
                ->orWhere('q.document_identity', 'like', '%' . $search . '%')
                ->orWhere('v.name', 'like', '%' . $search . '%')
                ->orWhere('e.event_code', 'like', '%' . $search . '%')
                ->orWhere('s.name', 'like', '%' . $search . '%')
                ->orWhere('u.user_name', 'like', '%' . $search . '%');
        });
    }

    // Date range filtering
    if (!empty($date_from) && !empty($date_to)) {
        $data = $data->whereBetween('vp_quotation_rfq.date_sent', [
            $date_from . ' 00:00:00',
            $date_to . ' 23:59:59'
        ]);
    } elseif (!empty($date_from)) {
        $data = $data->where('vp_quotation_rfq.date_sent', '>=', $date_from . ' 00:00:00');
    } elseif (!empty($date_to)) {
        $data = $data->where('vp_quotation_rfq.date_sent', '<=', $date_to . ' 23:59:59');
    }

    // Exact match filters for total_items and items_quoted
    if (is_numeric($total_items) && $total_items >= 0) {
        $data = $data->havingRaw('(SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id) = ?', [$total_items]);
    }
    if (is_numeric($items_quoted) && $items_quoted >= 0) {
        $data = $data->havingRaw('(SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != "") = ?', [$items_quoted]);
    }

    // Status sorting
    if ($sort_column == 'status') {
        $orderByCase = "CASE 
            WHEN vp_quotation_rfq.is_cancelled = 1 THEN 'Cancelled'
            WHEN (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != '') = 0 AND vp_quotation_rfq.date_required >= '$currentDate' THEN 'Bid Sent'
            WHEN (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != '') > 0 AND (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != '') < (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id) AND vp_quotation_rfq.date_required >= '$currentDate' THEN 'Partial'
            WHEN (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != '') = (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id) THEN 'Bid Received'
            WHEN vp_quotation_rfq.date_required < '$currentDate' THEN 'Bid Expired'
            ELSE '-'
        END";
        $data = $data->orderByRaw("$orderByCase $sort_direction");
    } else {
        // Validate sort_column to prevent SQL injection
        $allowed_columns = ['created_at', 'document_identity', 'date_sent', 'date_required', 'total_items', 'items_quoted'];
        $sort_column = in_array($sort_column, $allowed_columns) ? $sort_column : 'created_at';

        // Handle sorting for total_items and items_quoted
        if ($sort_column == 'total_items') {
            $data = $data->orderByRaw('(SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id) ' . $sort_direction);
        } elseif ($sort_column == 'items_quoted') {
            $data = $data->orderByRaw('(SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != "") ' . $sort_direction);
        } else {
            $data = $data->orderBy($sort_column, $sort_direction);
        }
    }

    // Select fields with dynamic counts
    $data = $data->select(
        'vp_quotation_rfq.*',
        'q.document_identity as quotation_no',
        'v.name as vessel_name',
        'e.event_code as event_code',
        's.name as vendor_name',
        'u.user_name as person_incharge_name',
        DB::raw("(SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id) as total_items"),
        DB::raw("(SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != '') as items_quoted"),
        DB::raw("CASE 
            WHEN vp_quotation_rfq.is_cancelled = 1 THEN 'Cancelled'
            WHEN (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != '') = 0 AND vp_quotation_rfq.date_required >= '$currentDate' THEN 'Bid Sent'
            WHEN (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != '') > 0 AND (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != '') < (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id) AND vp_quotation_rfq.date_required >= '$currentDate' THEN 'Partial'
            WHEN (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id AND vqd.vendor_rate IS NOT NULL AND vqd.vendor_rate != '') = (SELECT COUNT(*) FROM vp_quotation_rfq_detail vqd WHERE vqd.id = vp_quotation_rfq.id) THEN 'Bid Received'
            WHEN vp_quotation_rfq.date_required < '$currentDate' THEN 'Bid Expired'
            ELSE '-'
        END as status")
    );

    // Paginate results
    $data = $data->paginate($perPage, ['*'], 'page', $page);

    return response()->json($data);
}

    public function actions(Request $request)
    {
        if (!isPermission('edit', 'vp_quotation', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, "No Permission");

        $ids = $request->input('id', []);
        $date_required = $request->input('date_required', '');
        $send_notification = $request->input('send_notification', 0);
        $toggleIsCancelled = $request->input('toggle_is_cancelled', 0);
        $rfq_reset = $request->input('rfq_reset', 0);

        if (empty($ids)) {
            return $this->jsonResponse("No Records Selected", 400, "Request Failed!");
        }

        foreach ($ids as $id) {
            $rfq = VpQuotationRfq::find($id);
            if (!$rfq) {
                return $this->jsonResponse("RFQ not found for ID: $id", 404, "Request Failed!");
            }
            if ($rfq_reset == 1) {
                $rfq->date_returned = null;
                $rfq->is_cancelled = 0;
                VpQuotationRfqDetail::where('id', $id)->update([
                    'vendor_rate' => null,
                    'vendor_part_no' => null,
                    'vendor_notes' => null,
                ]);
             
            }

            if ($toggleIsCancelled == 1) {
                $rfq->is_cancelled = $rfq->is_cancelled == 1 ? 0 : 1;
            }

            if (!empty($date_required)) {
                $rfq->date_required = $date_required;
            }

            $rfq->save();

            if ($send_notification == 1) {
                $this->sendRFQNotification($id);
            }
        }

        return $this->jsonResponse([], 200, "Vendor Quotation RFQ updated successfully!");
    }

    public function sendRFQNotification($id)
    {
        try {

            $data = VpQuotationRfq::with('quotation', 'vendor')->find($id);
            $link = env("VENDOR_URL") . "quotation/{$id}";
            $payload = [
                'template' => 'vendor_quotation_rate_update',
                'data' => [
                    'link' => $link,
                    'quotation_no' => $data->quotation->document_identity,
                    'date_required' => Carbon::parse($data->date_required)->format('d M Y'),

                ],
                'email' => $data->vendor->email,
                'name' => $data->vendor->name,
                'subject' => "RFQ Notification for Quotation ID: {$data->quotation->document_identity}",
                'message' => '',
            ];
            $this->sendEmail($payload);
        } catch (\Exception $e) {
            Log::error("Error sending RFQ notification: " . $e->getMessage());
            return $this->jsonResponse([], 500, "Failed to send RFQ notification.");
        } finally {
            $data->notification_count += 1;
            $data->save();
        }
    }
}
