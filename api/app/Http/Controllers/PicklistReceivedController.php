<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\Picklist;
use App\Models\PicklistDetail;
use App\Models\PicklistReceived;
use App\Models\PicklistReceivedDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

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
		$receivedData = PicklistReceived::with("picklist_received_detail", "picklist_received_detail.product")
			->where('picklist_id', $id)
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
				
					$picklist_remainings[] = [
						"picklist_detail_id" => $detail->picklist_detail_id,
						"product_id" => $productId,
						"product_name" => $detail->product->name,
						"original_quantity" => $originalQty,
						"received_quantity" => $receivedQty,
						"remaining_quantity" => $remainingQty,
					];
				
			}
		}

		$response = [
			"history" => $receivedData,
			"picklist" => $picklist_remainings
		];

		return $this->jsonResponse($response, 200, "Picklist Received History");
	}

	public function update(Request $request, $id)
	{
		// if (!isPermission('edit', 'picklist_received', $request->permission_list)) {
		//     return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		// }


		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->documentTypeId, $request);

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
			'total_quantity' => $request->total_quantity,
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		]);

		$picklistReceivedDetails = [];
		foreach ($request->picklist_detail as $key => $item) {
			$picklistReceivedDetails[] = [
				'picklist_received_id' => $uuid,
				'picklist_received_detail_id' => $this->get_uuid(),
				'sort_order' => $key,
				'picklist_detail_id' => $item['picklist_detail_id'],
				'product_id' => $item['product_id'],
				'quantity' => $item['quantity'] ?? 0,
				'created_at' => Carbon::now(),
				'created_by' => $request->login_user_id,
			];
		}
		PicklistReceivedDetail::insert($picklistReceivedDetails);


		return $this->jsonResponse([], 200, "Picklist Items Successfully Received.");
	}
}
