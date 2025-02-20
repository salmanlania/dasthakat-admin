<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\Picklist;
use App\Models\PicklistDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class PicklistController extends Controller
{
	private int $documentTypeId = 43;

	public function index(Request $request)
	{
		$query = Picklist::with('charge_order')
			->where('company_id', $request->company_id)
			->where('company_branch_id', $request->company_branch_id);

		// Apply filters dynamically
		$filters = [
			'document_identity' => 'like',
			'document_date' => '=',
			'charge_order_id' => '=',
			'total_quantity' => 'like'
		];

		foreach ($filters as $field => $operator) {
			if ($value = $request->input($field)) {
				$query->where("picklist.$field", $operator, $operator === 'like' ? "%$value%" : $value);
			}
		}

		// Global search
		if ($search = strtolower($request->input('search', ''))) {
			$query->where(fn($q) => $q
				->where('charge_order.document_identity', 'like', "%$search%")
				->orWhere('picklist.document_identity', 'like', "%$search%"));
		}

		return response()->json(
			$query->orderBy(
				$request->input('sort_column', 'picklist.created_at'),
				$request->input('sort_direction') === 'ascend' ? 'asc' : 'desc'
			)->paginate($request->input('limit', 10))
		);
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
		// if (!isPermission('add', 'picklist', $request->permission_list)) {
		//     return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		// }

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
