<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\Servicelist;
use App\Models\ServicelistReceived;
use App\Models\ServicelistReceivedDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ServicelistReceivedController extends Controller
{
	private int $documentTypeId = 47;


	public function show($id, Request $request)
	{
		// Fetch the original servicelist
		$servicelist = Servicelist::with("servicelist_detail.product")
			->where('servicelist_id', $id)
			->first();

		// Fetch received servicelist history
		$receivedData = ServicelistReceived::with("servicelist_received_detail.product", "servicelist_received_detail.warehouse")
			->where('servicelist_id', $id)
			->orderBy('created_at', 'asc')
			->get();

		$servicelist_remainings = [];

		if ($servicelist) {
			// Initialize remaining quantities with original servicelist quantities
			foreach ($servicelist->servicelist_detail as $detail) {
				$productId = $detail->product_id;
				$originalQty = $detail->quantity;
				$receivedQty = 0;

				// Sum received quantities for this product
				foreach ($receivedData as $received) {
					foreach ($received->servicelist_received_detail as $receivedDetail) {
						if ($receivedDetail->charge_order_detail_id == $detail->charge_order_detail_id) {
							$receivedQty += $receivedDetail->quantity;
						}
					}
				}

				// Calculate remaining quantity
				$remainingQty = max(0, $originalQty - $receivedQty);
				if ($remainingQty > 0) {
					$servicelist_remainings[] = [
						"servicelist_detail_id" => $detail->servicelist_detail_id,
						"product_id" => $productId,
						"product_name" => $detail->product->name ?? "",
						"product" => $detail->product ?? "",
						"product_description" => $detail->charge_order_detail->product_description ?? "",
						"original_quantity" => $originalQty,
						"received_quantity" => $receivedQty,
						"remaining_quantity" => $remainingQty,
						"sort_order" => $detail->sort_order ?? 0,
						"charge_order_detail_id" => $detail->charge_order_detail_id,
					];
				}
			}
		}
		usort($servicelist_remainings, function($a, $b) {
			return $a['sort_order'] - $b['sort_order'];
		});

		// Add original quantity for history items
		$historyWithOriginalQty = $receivedData->map(function ($received) use ($servicelist) {
			$received->servicelist_received_detail->transform(function ($detail) use ($servicelist) {
				// Find the original quantity from the servicelist details
				$thisServicelist = $servicelist->servicelist_detail->firstWhere('charge_order_detail_id', $detail->charge_order_detail_id);
				$originalQty = optional($thisServicelist)->quantity ?? 0;
				$detail->original_quantity = $originalQty;
				$detail->product_description = optional($thisServicelist)->charge_order_detail->product_description ?? "";
				return $detail;
			});
			return $received;
		});

		$response = [
			"history" => $historyWithOriginalQty,
			"servicelist" => $servicelist_remainings
		];

		return $this->jsonResponse($response, 200, "Servicelist Received History");
	}
	public function Validator($request, $id = null)
	{
		$rules = [
			'document_date' => 'required|date',
			'servicelist_detail' => 'required|array|min:1',
			'servicelist_detail.*.servicelist_detail_id' => 'required',
			'servicelist_detail.*.quantity' => 'required|numeric|min:0',
		];

		$msg = validateRequest($request, $rules);
		if (!empty($msg)) return $msg;
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('receive', 'servicelist', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		$isError = $this->Validator($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");
		DB::beginTransaction();
		try{
	
		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->documentTypeId, $request);

		$servicelist = Servicelist::where('servicelist_id', $id)->first();

		ServicelistReceived::create([
			'company_id' => $request->company_id,
			'company_branch_id' => $request->company_branch_id,
			'servicelist_received_id' => $uuid,
			'document_type_id' => $document['document_type_id'],
			'document_no' => $document['document_no'],
			'document_date' => $request->document_date,
			'document_identity' => $document['document_identity'],
			'document_prefix' => $document['document_prefix'],
			'servicelist_id' => $id,
			'charge_order_id' => $servicelist->charge_order_id,
			'total_quantity' => $request->total_quantity,
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		]);
		$index = 0;
		$servicelistReceivedDetails = [];
		foreach ($request->servicelist_detail as $key => $item) {
			$servicelistReceivedDetails[] = [
				'servicelist_received_id' => $uuid,
				'servicelist_received_detail_id' => $this->get_uuid(),
				'sort_order' => $index++,
				'servicelist_detail_id' => $item['servicelist_detail_id'] ?? "",
				'charge_order_detail_id' => $item['charge_order_detail_id'] ?? "",
				'warehouse_id' => $item['warehouse_id'] ?? "",
				'product_id' => $item['product_id'] ?? "",
				'remarks' => $item['remarks'] ?? "",
				'quantity' => $item['quantity'] ?? 0,
				'created_at' => Carbon::now(),
				'created_by' => $request->login_user_id,
			];
		}
		ServicelistReceivedDetail::insert($servicelistReceivedDetails);

		DB::commit();
		return $this->jsonResponse([], 200, "Servicelist Items Successfully Received.");
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Servicelist Received Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while receiving Servicelist.", 500, "Transaction Failed");
		}
	}
}
