<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\DocumentType;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\purchaseReturn;
use App\Models\purchaseReturnDetail;
use App\Models\StockLedger;
use App\Models\Warehouse;
use Carbon\Carbon;

class PurchaseReturnController extends Controller
{
	protected $document_type_id = 52;

	public function index(Request $request)
	{

		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$charge_order_id = $request->input('charge_order_id', '');
		$purchase_order_id = $request->input('purchase_order_id', '');
		$supplier_id = $request->input('supplier_id', '');
		$event_id = $request->input('event_id', '');
		$vessel_id = $request->input('vessel_id', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'purchase_return.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = PurchaseReturn::LeftJoin('charge_order as co', 'co.charge_order_id', '=', 'purchase_return.charge_order_id')
			->LeftJoin('purchase_order as po', 'po.purchase_order_id', '=', 'purchase_return.purchase_order_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'co.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'co.vessel_id')
			->LeftJoin('supplier as s', 's.supplier_id', '=', 'po.supplier_id');

		$data = $data->where('purchase_return.company_id', '=', $request->company_id);
		$data = $data->where('purchase_return.company_branch_id', '=', $request->company_branch_id);

		if (!empty($purchase_order_id)) $data = $data->where('purchase_return.purchase_order_id', '=',  $purchase_order_id);
		if (!empty($charge_order_id)) $data = $data->where('purchase_return.charge_order_id', '=',  $charge_order_id);
		if (!empty($event_id)) $data = $data->where('co.event_id', '=',  $event_id);
		if (!empty($vessel_id)) $data = $data->where('co.vessel_id', '=',  $vessel_id);
		if (!empty($supplier_id)) $data = $data->where('po.supplier_id', '=',  $supplier_id);
		if (!empty($document_identity)) $data = $data->where('purchase_return.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('purchase_return.document_date', '=',  $document_date);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query

					->Where('co.document_identity', 'like', '%' . $search . '%')
					->OrWhere('po.document_identity', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('s.name', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('purchase_return.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("purchase_return.*", "co.document_identity as charge_no", "e.event_code", "v.name as vessel_name", "s.name as supplier_name", "po.document_identity as purhcase_order_no");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = PurchaseReturn::with(
			"purchase_return_detail",
			"purchase_return_detail.charge_order_detail",
			"purchase_return_detail.product",
			"purchase_return_detail.product.product_type",
			"purchase_return_detail.unit",
			"purchase_order",
			"purchase_order.supplier",
			"charge_order",
			"charge_order.salesman",
			"charge_order.service_order",
			"charge_order.event",
			"charge_order.vessel",
			"charge_order.customer",
			"charge_order.flag",
			"charge_order.agent",
			"charge_order.port",
			"charge_order.quotation",
			"charge_order.quotation.payment",
		)
			->where('purchase_return_id', $id)->first();

		return $this->jsonResponse($data, 200, "View Api Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'purchase_order_id' => ['required'],
			'purchase_return_detail' => 'required|array',
			'purchase_return_detail.*.purchase_order_detail_id' => 'required',
			'purchase_return_detail.*.quantity' => 'required|numeric|min:1',
		];


		$validator = Validator::make($request, $rules);
		$response = [];
		if ($validator->fails()) {
			$response =  $errors = $validator->errors()->all();
			$firstError = $validator->errors()->first();
			return  $firstError;
		}
		return [];
	}



	public function store(Request $request)
	{
		if (!isPermission('add', 'purchase_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		$validationError = $this->validateRequest($request->all());
		if (!empty($validationError)) {
			return $this->jsonResponse($validationError, 400, "Request Failed!");
		}

		$PurchaseOrder = PurchaseOrder::find($request->purchase_order_id);
		if (!$PurchaseOrder) {
			return $this->jsonResponse('Purchase Order not found.', 404);
		}

		// $chargeOrder = ChargeOrder::with('charge_order_detail')->find($PurchaseOrder->charge_order_id);
		// if (!$chargeOrder) {
		// 	return $this->jsonResponse('Charge Order not found.', 404);
		// }

		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);

		$data = [
			'purchase_return_id'   => $uuid,
			'company_id'        => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'document_type_id'  => $document['document_type_id'] ?? "",
			'document_no'       => $document['document_no'] ?? "",
			'document_prefix'   => $document['document_prefix'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_date'     => $request->document_date ?? Carbon::now(),
			'charge_order_id'   => $PurchaseOrder->charge_order_id ?? "",
			'purchase_order_id' => $request->purchase_order_id,
			'created_at'        => Carbon::now(),
			'created_by'        => $request->login_user_id,
		];

		$totalQuantity = 0;
		$totalAmount = 0;
		$index = 0;
		if ($request->purchase_return_detail) {
			PurchaseReturn::create($data);

			foreach ($request->purchase_return_detail as $detail) {

				$PurchaseOrderDetail = PurchaseOrderDetail::find($detail['purchase_order_detail_id']);
				if (!empty($PurchaseOrderDetail->product_id)) {
					$Product = Product::with('unit')->find($PurchaseOrderDetail->product_id);
				}
				if (!empty($detail["warehouse_id"])) {
					$Warehouse = Warehouse::find($detail["warehouse_id"]);
				}


				$amount = $PurchaseOrderDetail->rate * $detail['quantity'];
				$totalQuantity += $detail['quantity'];
				$totalAmount += $amount;
				$detail_uuid = $this->get_uuid();
				PurchaseReturnDetail::create([
					'purchase_return_detail_id' => $detail_uuid,
					'purchase_return_id'       => $uuid,
					'charge_order_detail_id'   => $PurchaseOrderDetail->charge_order_detail_id ?? "",
					'purchase_order_detail_id' => $detail['purchase_order_detail_id'],
					'sort_order'               => $index++,
					'product_id'               => $PurchaseOrderDetail->product_id ?? "",
					'product_name'             => $PurchaseOrderDetail->product_name ?? "",
					'product_description'      => $PurchaseOrderDetail->product_description,
					'description'              => $PurchaseOrderDetail->description,
					'unit_id'                  => $PurchaseOrderDetail->unit_id,
					'vpart'                    => $PurchaseOrderDetail->vpart,
					'quantity'                 => $detail['quantity'],
					'warehouse_id'             => $detail['warehouse_id'] ?? "",
					'rate'                     => $PurchaseOrderDetail->rate,
					'amount'                   => $amount,
					'vendor_notes'             => $PurchaseOrderDetail->vendor_notes,
					'created_at'               => Carbon::now(),
					'created_by'               => $request->login_user_id,
				]);

				if ($PurchaseOrderDetail->product_type_id == 2 && !empty($detail["warehouse_id"]) && ($detail["quantity"] > 0)) {

					$stockEntry = [
						'sort_order' => $index,
						'product_id' => $PurchaseOrderDetail->product_id,
						'warehouse_id' => $detail["warehouse_id"] ?? "",
						'unit_id' => $Product->unit_id ?? null,
						'unit_name' =>  $Product->unit->name ?? null,
						'quantity' => $detail["quantity"],
						'rate' => $PurchaseOrderDetail->rate,
						'amount' => $amount,
						'remarks'      => sprintf(
							"%d %s of %s (Code: %s) returned in %s warehouse under Purchase Return document %s. Original rate: %s. Total amount: %s.",
							$detail["quantity"] ?? 0,
							$Product->unit->name ?? '',
							$Product->name ?? 'Unknown Product',
							$Product->impa_code ?? 'N/A',
							$Warehouse->name ?? 'Unknown Warehouse',
							$PurchaseOrder->document_identity ?? 'N/A',
							$chargeOrderDetail->rate ?? 'N/A',
							$amount ?? '0.00'
						),
					];
					StockLedger::handleStockMovement([
						'sort_order' => $index,
						'master_model' => new PurchaseReturn,
						'document_id' => $uuid,
						'document_detail_id' => $detail_uuid,
						'row' => $stockEntry,
					], 'O');
				}
			}
			$PR = PurchaseReturn::find($uuid);

			$PR->total_quantity = $totalQuantity;
			$PR->total_amount   = $totalAmount;

			$PR->save();
		}

		if ($totalQuantity > 0) {
			return $this->jsonResponse(['purchase_return_id' => $uuid], 200, "Add Purchase Return Successfully!");
		} else {
			return $this->jsonResponse(['purchase_return_id' => $uuid], 500, "Cannot generate Return: No items with available quantity.");
		}
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'purchase_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		$validationError = $this->validateRequest($request->all());
		if (!empty($validationError)) {
			return $this->jsonResponse($validationError, 400, "Request Failed!");
		}

		$purchaseReturn = PurchaseReturn::find($id);
		if (!$purchaseReturn) {
			return $this->jsonResponse('Purchase Return not found.', 404);
		}

		$PurchaseOrder = PurchaseOrder::find($request->purchase_order_id);
		if (!$PurchaseOrder) {
			return $this->jsonResponse('Purchase Order not found.', 404);
		}

		// $chargeOrder = ChargeOrder::with('charge_order_detail')->find($PurchaseOrder->charge_order_id);
		// if (!$chargeOrder) {
		// 	return $this->jsonResponse('Charge Order not found.', 404);
		// }

		// $purchaseReturn->vpart = $request->vpart ?? $purchaseReturn->vpart;
		$purchaseReturn->document_date = $request->document_date ?? $purchaseReturn->document_date;
		// $purchaseReturn->vendor_notes = $request->vendor_notes ?? $purchaseReturn->vendor_notes;
		$purchaseReturn->updated_at = Carbon::now();
		$purchaseReturn->updated_by = $request->login_user_id;
		$purchaseReturn->save();


		$totalQuantity = 0;
		$totalAmount = 0;
		$index = 0;
		if ($request->purchase_return_detail) {

			foreach ($request->purchase_return_detail as $detail) {
				// $PurchaseOrderDetail = PurchaseOrderDetail::find($detail['purchase_order_detail_id']);
				// $ChargeOrderDetail = ChargeOrderDetail::where('product_type_id', "!=", 1)->find($PurchaseOrderDetail->charge_order_detail_id);
				if (!empty($detail['product_id'])) {
					$Product = Product::with('unit')->find($detail['product_id']);
				}
				if (!empty($detail["warehouse_id"])) {
					$Warehouse = Warehouse::find($detail["warehouse_id"]);
				}

				$index++;
				if ($detail['row_status'] == 'I') {

					// if (empty($ChargeOrderDetail)) continue;

					$amount = $detail['rate'] * $detail['quantity'];
					$totalQuantity += $detail['quantity'];
					$totalAmount += $amount;

					$detail_uuid = $this->get_uuid();
					purchaseReturnDetail::create([
						'purchase_return_detail_id' => $detail_uuid,
						'purchase_return_id'       => $id,
						'charge_order_detail_id'   => $detail['charge_order_detail_id'] ?? "",
						'purchase_order_detail_id' => $detail['purchase_order_detail_id'] ?? "",
						'sort_order'               => $index,
						'product_id'               => $detail['product_id'] ?? "",
						'product_name'             => $detail['product_name'] ?? "",
						'product_description'      => $detail['product_description'] ?? "",
						'description'              => $detail['description'] ?? "",
						'unit_id'                  => $detail['unit_id'] ?? "",
						'quantity'                 => $detail['quantity'] ?? "",
						'rate'                     => $detail['rate'] ?? "",
						'vendor_notes'             => $detail['vendor_notes'] ?? "",
						'vpart'                    => $detail['vpart'] ?? "",
						'amount'                   => $amount,
						'created_at'               => Carbon::now(),
						'created_by'               => $request->login_user_id,
					]);
					if ($detail['product_type_id'] == 2 && !empty($detail["warehouse_id"]) && ($detail["quantity"] > 0)) {

						$stockEntry = [
							'sort_order' => $index,
							'product_id' => $detail['product_id'],
							'warehouse_id' => $detail["warehouse_id"] ?? "",
							'unit_id' => $Product->unit_id ?? null,
							'unit_name' =>  $Product->unit->name ?? null,
							'quantity' => $detail["quantity"],
							'rate' => $detail['rate'],
							'amount' => $amount,
							'remarks'      => sprintf(
								"%d %s of %s (Code: %s) returned in %s warehouse under Purchase Return document %s. Original rate: %s. Total amount: %s.",
								$detail["quantity"] ?? 0,
								$Product->unit->name ?? '',
								$Product->name ?? 'Unknown Product',
								$Product->impa_code ?? 'N/A',
								$Warehouse->name ?? 'Unknown Warehouse',
								$PurchaseOrder->document_identity ?? 'N/A',
								$detail['rate'] ?? 'N/A',
								$amount ?? '0.00'
							),
						];
						StockLedger::handleStockMovement([
							'sort_order' => $index,
							'master_model' => new PurchaseReturn,
							'document_id' => $id,
							'document_detail_id' => $detail_uuid,
							'row' => $stockEntry,
						], 'O');
					}
				}
				if ($detail['row_status'] == 'U') {
						$totalQuantity += $detail['quantity'];
					$totalAmount += $detail['amount'];
					$row = [
						'sort_order' => $detail['sort_order'] ?? "",
						'product_id' => $detail['product_id'] ?? "",
						'product_name' => $detail['product_name'] ?? "",
						'product_description' => $detail['product_description'] ?? "",
						'description' => $detail['description'] ?? "",
						'unit_id' => $detail['unit_id'] ?? "",
						'quantity' => $detail['quantity'] ?? "",
						'vpart' => $detail['vpart'],
						'vendor_notes' => $detail['vendor_notes'],
						'rate' => $detail['rate'] ?? "",
						'amount' => $detail['amount'] ?? "",
						'updated_at' => Carbon::now(),
						'updated_by' => $request->login_user_id,
					];
					purchaseReturnDetail::where('purchase_return_detail_id', $detail['purchase_return_detail_id'])->update($row);
					StockLedger::where('document_detail_id', $detail['purchase_return_detail_id'])->delete();
					if ($detail['product_type_id'] == 2 && !empty($detail["warehouse_id"]) && ($detail["quantity"] > 0)) {

						$stockEntry = [
							'sort_order' => $index,
							'product_id' => $detail['product_id'],
							'warehouse_id' => $detail["warehouse_id"] ?? "",
							'unit_id' => $Product?->unit_id ?? null,
							'unit_name' =>  $Product?->unit?->name ?? null,
							'quantity' => $detail["quantity"],
							'rate' => $detail['rate'],
							'amount' => $detail['amount'],
							'remarks'      => sprintf(
								"%d %s of %s (Code: %s) returned in %s warehouse under Purchase Return document %s. Original rate: %s. Total amount: %s.",
								$detail["quantity"] ?? 0,
								$Product->unit->name ?? '',
								$Product->name ?? 'Unknown Product',
								$Product->impa_code ?? 'N/A',
								$Warehouse->name ?? 'Unknown Warehouse',
								$PurchaseOrder->document_identity ?? 'N/A',
								$detail['rate'] ?? 'N/A',
								$detail['amount'] ?? '0.00'
							),
						];
						StockLedger::handleStockMovement([
							'sort_order' => $index,
							'master_model' => new PurchaseReturn,
							'document_id' => $id,
							'document_detail_id' => $detail->purchase_return_detail_id,
							'row' => $stockEntry,
						], 'O');
					}
				}
				if ($detail->row_status == 'D') {
					purchaseReturnDetail::where('purchase_return_detail_id', $detail->purchase_return_detail_id)->delete();
					StockLedger::where('document_detail_id', $detail->purchase_return_detail_id)->delete();
				}
			}

			$purchaseReturn->total_quantity = $totalQuantity;
			$purchaseReturn->total_amount = $totalAmount;
			$purchaseReturn->save();
		}

		return $this->jsonResponse(['purchase_return_id' => $id], 200, "Purchase Return Updated Successfully!");
	}


	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'purchase_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403);
		}

		$data = PurchaseReturn::find($id);
		if (!$data) {
			return $this->jsonResponse(['purchase_return_id' => $id], 404, "Purchase Return Not Found!");
		}

		$data->delete();
		purchaseReturnDetail::where('purchase_return_id', $id)->delete();

		return $this->jsonResponse(['purchase_return_id' => $id], 200, "Purchase Return Deleted Successfully!");
	}

	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'purchase_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403);
		}

		try {
			$ids = $request->purchase_return_ids ?? [];
			if (empty($ids)) {
				return $this->jsonResponse('No Purchase Return IDs provided', 400);
			}

			$purchaseReturns = PurchaseReturn::whereIn('purchase_return_id', $ids)->get();
			$deletedCount = 0;

			foreach ($purchaseReturns as $purchaseReturn) {
				$purchaseReturn->delete();
				purchaseReturnDetail::where('purchase_return_id', $purchaseReturn->purchase_return_id)->delete();
				$deletedCount++;
			}

			return $this->jsonResponse('Deleted', 200, "{$deletedCount} Purchase Return(s) Deleted Successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('Some error occurred', 500, $e->getMessage());
		}
	}
}
