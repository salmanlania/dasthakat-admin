<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\Picklist;
use App\Models\PicklistDetail;
use App\Models\PicklistReceived;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class PicklistController extends Controller
{
	private int $documentTypeId = 43;

	public function index(Request $request)
	{

		$sortColumn = $request->input('sort_column', 'picklist.created_at');
		$sortDirection = $request->input('sort_direction') === 'ascend' ? 'asc' : 'desc';
		$document_date = $request->input('document_date', '');
		$document_identity = $request->input('document_identity', '');
		$charge_order_no = $request->input('charge_order_no', '');
		$charge_order_id = $request->input('charge_order_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$event_id = $request->input('event_id', '');
		$total_quantity = $request->input('total_quantity', '');


		$query = Picklist::LeftJoin('charge_order as c', 'c.charge_order_id', '=', 'picklist.charge_order_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'c.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'c.vessel_id')
			->where('picklist.company_id', $request->company_id)
			->where('picklist.company_branch_id', $request->company_branch_id)
			->selectRaw("
        picklist.*,e.event_id,e.event_code,v.vessel_id,v.name as vessel_name,c.document_identity as charge_order_no,
        CASE 
            -- If no received records exist, status = 3 (Nothing received)
            WHEN NOT EXISTS (
                SELECT 1 FROM picklist_received_detail prd 
                JOIN picklist_received pr ON pr.picklist_received_id = prd.picklist_received_id 
                WHERE pr.picklist_id = picklist.picklist_id
            ) THEN 3

            -- If total received quantity for any picklist_detail is still less than required, status = 2 (Some items pending)
            WHEN EXISTS (
                SELECT 1 FROM picklist_detail pd
                LEFT JOIN (
                    SELECT prd.picklist_detail_id, SUM(prd.quantity) AS total_received
                    FROM picklist_received_detail prd
                    GROUP BY prd.picklist_detail_id
                ) received_summary
                ON pd.picklist_detail_id = received_summary.picklist_detail_id
                WHERE pd.picklist_id = picklist.picklist_id
                AND (received_summary.total_received IS NULL OR received_summary.total_received < pd.quantity)
            ) THEN 2

            -- If all items are fully received, status = 1 (All received completely)
            ELSE 1
        END AS picklist_status
    ");


		if (!empty($document_date)) $query = $query->where('picklist.document_date', 'like', '%' . $document_date . '%');
		if (!empty($document_identity)) $query = $query->where('picklist.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($charge_order_no)) $query = $query->where('c.document_identity', 'like', '%' . $charge_order_no . '%');
		if (!empty($charge_order_id)) $query = $query->where('c.charge_order_id', '=',  $charge_order_id);
		if (!empty($vessel_id)) $query = $query->where('v.vessel_id', '=', $vessel_id);
		if (!empty($event_id)) $query = $query->where('e.event_id', '=', $event_id);
		if (!empty($total_quantity)) $query = $query->where('total_quantity', 'like', '%' . $total_quantity . '%');


		if ($picklist_status = $request->input('picklist_status')) {
			$query->having('picklist_status', '=', $picklist_status);
		}


		// Global search
		if ($search = strtolower($request->input('search', ''))) {
			$query->where(
				fn($q) => $q
					->where('c.document_identity', 'like', "%$search%")
					->orWhere('picklist.document_identity', 'like', "%$search%")
					->orWhere('v.name', 'like', "%$search%")
					->orWhere('e.event_code', 'like', "%$search%")
			);
		}


		if ($sortColumn === 'picklist_status') {
			$query->orderByRaw("
            CASE 
                WHEN NOT EXISTS (
                    SELECT 1 FROM picklist_received_detail prd 
                    JOIN picklist_received pr ON pr.picklist_received_id = prd.picklist_received_id 
                    WHERE pr.picklist_id = picklist.picklist_id
                ) THEN 3
                WHEN EXISTS (
                    SELECT 1 FROM picklist_detail pd
                    LEFT JOIN (
                        SELECT prd.picklist_detail_id, SUM(prd.quantity) AS total_received
                        FROM picklist_received_detail prd
                        GROUP BY prd.picklist_detail_id
                    ) received_summary
                    ON pd.picklist_detail_id = received_summary.picklist_detail_id
                    WHERE pd.picklist_id = picklist.picklist_id
                    AND (received_summary.total_received IS NULL OR received_summary.total_received < pd.quantity)
                ) THEN 2
                ELSE 1
            END $sortDirection
        ");
		} else {
			$query->orderBy($sortColumn, $sortDirection);
		}

		return response()->json($query->paginate($request->input('limit', 10)));
	}

	public function show($id, Request $request)
	{
		// Fetch the original picklist with related details
		$picklist = Picklist::with([
			"charge_order",
			"charge_order.vessel",
			"charge_order.event",
			"picklist_detail",
			"picklist_detail.product"
		])->where('picklist_id', $id)->first();

		if (!$picklist) {
			return $this->jsonResponse(null, 404, "Picklist not found");
		}

		// Fetch received picklist history
		$receivedData = PicklistReceived::with([
			"picklist_received_detail",
			"picklist_received_detail.pulled_by",
			"picklist_received_detail.product",
			"picklist_received_detail.warehouse"
		])->where('picklist_id', $id)->get();

		// Prepare response data
		$items = [];

		foreach ($picklist->picklist_detail as $detail) {
			$picklistDetailId = $detail->picklist_detail_id;

			// Get received details for this specific picklist detail item
			$receivedDetails = $receivedData->flatMap(function ($received) {
				return $received->picklist_received_detail;
			})->where('picklist_detail_id', $picklistDetailId);

			// Sum received quantity
			$totalReceivedQty = $receivedDetails->sum('quantity');

			$warehouseNames = $receivedDetails->pluck('warehouse.name')->filter()->unique()->implode(', ');
			$remarks = $receivedDetails->pluck('remarks')->filter()->unique()->implode(', ');

			$items[] = [
				"picklist_detail_id" => $picklistDetailId,
				"product" => $detail->product ?? null,
				"original_quantity" => $detail->quantity,
				"total_received_quantity" => $totalReceivedQty,
				"remarks" => $remarks ?: null, // Show null if empty
				"warehouse" => ["name" => $warehouseNames ?: null], // Show null if empty
			];
		}

		// Final response structure
		$response = [
			...$picklist->toArray(), // Convert picklist model to an array
			"items" => $items,
		];

		return $this->jsonResponse($response, 200, "Picklist Details");
	}


	private function validateRequest(array $data): ?array
	{
		$validator = Validator::make($data, [
			'charge_order_id' => ['required'],
		]);

		return $validator->fails() ? $validator->errors()->all() : null;
	}

	public function store(Request $request)
	{
		if (!isPermission('add', 'picklist', $request->permission_list)) {
		    return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		// Validation
		if ($errors = $this->validateRequest($request->all())) {
			return $this->jsonResponse($errors, 400, "Request Failed!");
		}

		$chargeOrder = ChargeOrder::with('charge_order_detail')
			->findOrFail($request->charge_order_id);

		$inventoryDetails = $chargeOrder->charge_order_detail
			->where('product_type_id', 2)
			->where('picklist_detail_id', null);
		if ($inventoryDetails->isNotEmpty()) {
			$totalQuantity = $inventoryDetails->sum('quantity');

			$uuid = $this->get_uuid();
			$document = DocumentType::getNextDocument($this->documentTypeId, $request);

			Picklist::create([
				'company_id' => $request->company_id,
				'company_branch_id' => $request->company_branch_id,
				'picklist_id' => $uuid,
				'document_type_id' => $document['document_type_id'],
				'document_date' => Carbon::now(),
				'document_no' => $document['document_no'],
				'document_identity' => $document['document_identity'],
				'document_prefix' => $document['document_prefix'],
				'charge_order_id' => $request->charge_order_id,
				'total_quantity' => $totalQuantity,
				'created_at' => Carbon::now(),
				'created_by' => $request->login_user_id,
			]);

			$picklistDetails = [];
			$index = 0;
			foreach ($inventoryDetails as $item) {
				$detail_uuid = $this->get_uuid();
				$picklistDetails[] = [
					'picklist_id' => $uuid,
					'picklist_detail_id' => $this->get_uuid(),
					'sort_order' => $index++,
					'charge_order_detail_id' => $item['charge_order_detail_id'],
					'product_id' => $item['product_id'],
					'product_description' => $item['product_description'],
					'quantity' => $item['quantity'] ?? 0,
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id,
				];
				ChargeOrderDetail::where('charge_order_detail_id', $item->charge_order_detail_id)
					->update([
						'picklist_id'        => $uuid,
						'picklist_detail_id' => $detail_uuid,
					]);
			}
			PicklistDetail::insert($picklistDetails);

			return $this->jsonResponse([], 200, "Charge Order ({$chargeOrder->document_identity}) Picklist Created Successfully!");
		}
		return $this->jsonResponse([], 200, "No inventory products available for picklist creation.");
	}

	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'picklist', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		Picklist::where('picklist_id', $id)->delete();
		PicklistDetail::where('picklist_id', $id)->delete();

		return $this->jsonResponse([], 200, "Record Deleted Successfully!");
	}

	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'picklist', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		if (!is_array($request->id) || empty($request->id)) {
			return $this->jsonResponse('Invalid request data', 400, "Request Failed!");
		}

		Picklist::whereIn('picklist_id', $request->id)->delete();
		PicklistDetail::whereIn('picklist_id', $request->id)->delete();

		return $this->jsonResponse([], 200, "Records Deleted Successfully!");
	}
}
