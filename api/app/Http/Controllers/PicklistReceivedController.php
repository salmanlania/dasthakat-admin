<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\Picklist;
use App\Models\PicklistReceived;
use App\Models\PicklistReceivedDetail;
use App\Models\Product;
use App\Models\StockLedger;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class PicklistReceivedController extends Controller
{
	private int $documentTypeId = 44;


	public function show($id, Request $request)
	{
		// Fetch the original picklist
		$picklist = Picklist::with("picklist_detail", "picklist_detail.product")
			->where('picklist_id', $id)
			->first();

		// Fetch received picklist history
		$receivedData = PicklistReceived::with("picklist_received_detail", "picklist_received_detail.product", "picklist_received_detail.warehouse")
			->where('picklist_id', $id)
			->orderBy('created_at', 'asc')
			->get();

		$picklist_remainings = [];

		if ($picklist) {
			// Initialize remaining quantities with original picklist quantities
			foreach ($picklist->picklist_detail as $detail) {
				$productId = $detail->product_id;
				$originalQty = $detail->quantity;
				$receivedQty = 0;

				// Sum received quantities for this product
				foreach ($receivedData as $received) {
					foreach ($received->picklist_received_detail as $receivedDetail) {
						if ($receivedDetail->product_id == $productId) {
							$receivedQty += $receivedDetail->quantity;
						}
					}
				}

				// Calculate remaining quantity
				$remainingQty = max(0, $originalQty - $receivedQty);
				if ($remainingQty > 0) {
					$picklist_remainings[] = [
						"picklist_detail_id" => $detail->picklist_detail_id,
						"charge_order_detail_id" => $detail->charge_order_detail_id ?? null,
						"product_id" => $productId,
						"product_name" => $detail->product->name ?? "",
						"product" => $detail->product ?? "",
						"original_quantity" => $originalQty,
						"received_quantity" => $receivedQty,
						"remaining_quantity" => $remainingQty,
					];
				}
			}
		}

		// Add original quantity for history items
		$historyWithOriginalQty = $receivedData->map(function ($received) use ($picklist) {
			$received->picklist_received_detail->transform(function ($detail) use ($picklist) {
				// Find the original quantity from the picklist details
				$originalQty = optional($picklist->picklist_detail->firstWhere('product_id', $detail->product_id))->quantity ?? 0;
				$detail->original_quantity = $originalQty;
				
				return $detail;
			});
			return $received;
		});

		$response = [
			"history" => $historyWithOriginalQty,
			"picklist" => $picklist_remainings
		];

		return $this->jsonResponse($response, 200, "Picklist Received History");
	}
	public function Validator($request, $id = null)
	{
		$rules = [
			'document_date' => 'required|date',
			'picklist_detail' => 'required|array|min:1',
			'picklist_detail.*.picklist_detail_id' => 'required',
			'picklist_detail.*.quantity' => 'required|numeric|min:0',
		];

		$msg = validateRequest($request, $rules);
		if (!empty($msg)) return $msg;
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('receive', 'picklist', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		$isError = $this->Validator($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->documentTypeId, $request);

		$picklist = Picklist::where('picklist_id', $id)->first();

		PicklistReceived::create([
			'company_id' => $request->company_id,
			'company_branch_id' => $request->company_branch_id,
			'picklist_received_id' => $uuid,
			'document_type_id' => $document['document_type_id'],
			'document_no' => $document['document_no'],
			'document_date' => $request->document_date,
			'document_identity' => $document['document_identity'],
			'document_prefix' => $document['document_prefix'],
			'picklist_id' => $id,
			'charge_order_id' => $picklist->charge_order_id,
			'total_quantity' => $request->total_quantity,
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		]);

		$picklistReceivedDetails = [];
		$index = 0;
		foreach ($request->picklist_detail as $key => $item) {
			$product = Product::with('unit')->where('product_id', $item['product_id'])->first();
			$detail_uuid = $this->get_uuid();
			$picklistReceivedDetails[] = [
				'picklist_received_id' => $uuid,
				'picklist_received_detail_id' => $detail_uuid,
				'sort_order' => $index++,
				'picklist_detail_id' => $item['picklist_detail_id'] ?? "",
				'warehouse_id' => $item['warehouse_id'] ?? "",
				'product_id' => $item['product_id'] ?? "",
				'charge_order_detail_id' => $item['charge_order_detail_id'] ?? "",
				'remarks' => $item['remarks'] ?? null,
				'quantity' => $item['quantity'] ?? 0,
				'created_at' => Carbon::now(),
				'created_by' => $request->login_user_id,
			];

			if ($product->product_type_id == 2 && !empty($item['warehouse_id']) && ($item['quantity'] > 0)) {
				$item['unit_id'] = $product->unit_id ?? null;
				$item['unit_name'] = $product->unit->name ?? null;
				$value['remarks'] = sprintf(
					"%d %s of %s (Code: %s) deducted from %s - Document: %s",
					$value['quantity'] ?? 0,
					$value['unit_name'] ?? '',
					$product->name ?? 'Unknown Product',
					$product->impa_code ?? 'N/A',
					$warehouse['name'] ?? 'Unknown Warehouse',
					$picklist->document_identity ?? ''
				);
				StockLedger::handleStockMovement([
					'sort_order' => $key,
					'master_model' => new PicklistReceived,
					'document_id' => $uuid,
					'document_detail_id' => $detail_uuid,
					'row' => $item,
				], 'O');
			}
		}
		PicklistReceivedDetail::insert($picklistReceivedDetails);


		return $this->jsonResponse([], 200, "Picklist Items Successfully Received.");
	}
}
