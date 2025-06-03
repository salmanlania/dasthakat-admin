<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\DocumentType;
use App\Models\Picklist;
use App\Models\PicklistDetail;
use App\Models\Product;
use App\Models\SaleReturn;
use App\Models\SaleReturnDetail;
use App\Models\StockLedger;
use App\Models\Warehouse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SaleReturnController extends Controller
{
	protected $document_type_id = 53;

	public function index(Request $request)
	{
		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$status = $request->input('status', '');
		$charge_order_no = $request->input('charge_order_no', '');
		$picklist_id = $request->input('picklist_id', '');
		$customer_id = $request->input('customer_id', '');
		$event_id = $request->input('event_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$ship_to = $request->input('ship_to', '');
		$ship_via = $request->input('ship_via', '');

		$search = $request->input('search', '');
		$page = $request->input('page', 1);
		$perPage = $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'sale_return.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = SaleReturn::LeftJoin('charge_order as co', 'co.charge_order_id', '=', 'sale_return.charge_order_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'co.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'co.vessel_id')
			->LeftJoin('customer as c', 'c.customer_id', '=', 'co.customer_id')
			->LeftJoin('picklist as p', 'p.picklist_id', '=', 'sale_return.picklist_id');

		$data = $data->where('sale_return.company_id', '=', $request->company_id);
		$data = $data->where('sale_return.company_branch_id', '=', $request->company_branch_id);

		if (!empty($picklist_id))
			$data = $data->where('sale_return.picklist_id', '=', $picklist_id);
		if (!empty($charge_order_no))
			$data = $data->where('co.document_identity', 'like', '%' . $charge_order_no . '%');
		if (!empty($event_id))
			$data = $data->where('co.event_id', '=', $event_id);
		if (!empty($ship_via))
			$data = $data->where('sale_return.ship_via', 'like', '%'. $ship_via. '%');
		if (!empty($ship_to))
			$data = $data->where('sale_return.ship_to', 'like', '%' . $ship_to . '%');
		if (!empty($status))
			$data = $data->where('sale_return.status', '=', $status);
		if (!empty($vessel_id))
			$data = $data->where('co.vessel_id', '=', $vessel_id);
		if (!empty($customer_id))
			$data = $data->where('co.customer_id', '=', $customer_id);
		if (!empty($document_identity))
			$data = $data->where('sale_return.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date))
			$data = $data->where('sale_return.document_date', '=', $document_date);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->Where('co.document_identity', 'like', '%' . $search . '%')
					->OrWhere('p.document_identity', 'like', '%' . $search . '%')
					->OrWhere('sale_return.status', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('c.name', 'like', '%' . $search . '%')
					->OrWhere('sale_return.ship_to', 'like', '%' . $search . '%')
					->OrWhere('sale_return.ship_via', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('sale_return.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select('sale_return.*', 'co.document_identity as charge_no', 'e.event_code', 'v.name as vessel_name', 'c.name as customer_name', 'p.document_identity as picklist_no');
		$data = $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{
		$data = SaleReturn::with(
			'sale_return_detail',
			'sale_return_detail.charge_order_detail',
			'sale_return_detail.picklist_detail',
			'sale_return_detail.product',
			'sale_return_detail.unit',
			'picklist',
			'charge_order',
			'charge_order.salesman',
			'charge_order.service_order',
			'charge_order.event',
			'charge_order.vessel',
			'charge_order.customer',
			'charge_order.flag',
			'charge_order.agent',
			'charge_order.port',
			'charge_order.quotation',
			'charge_order.quotation.term',
			'charge_order.quotation.payment',
			'created_by_user',
			'updated_by_user',
		)
			->where('sale_return_id', $id)
			->first();


			foreach ($data->sale_return_detail as &$detail) {
				if (!empty($detail->picklist_detail)) {
					$detail->picklist_detail->returned_quantity = $this->getReturnedQuantity((object) [
						'product_type_id' => 2,
						'charge_order_detail_id' => $detail->charge_order_detail_id
					]) ?? null;
				}
			}
			
		return $this->jsonResponse($data, 200, 'View Api Data');
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'picklist_id' => ['required'],
			'sale_return_detail' => 'required|array',
			'sale_return_detail.*.picklist_detail_id' => 'required',
			'sale_return_detail.*.warehouse_id' => 'required',
			'sale_return_detail.*.quantity' => 'required|numeric|min:1',
		];

		$validator = Validator::make($request, $rules);
		if ($validator->fails()) {
			return $validator->errors()->first();
		}
		return [];
	}

	public function bulkStore(Request $request)
	{
		if (!isPermission('add', 'sale_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, 'No Permission');
		}

		try {
			DB::beginTransaction();

			$uuid = null;
			foreach ($request->sale_returns as $key => $newObj) {
				$Picklist = Picklist::find($newObj['picklist_id']);
				if (!$Picklist) {
					throw new \Exception('Picklist not found.');
				}

				$chargeOrder = ChargeOrder::with('charge_order_detail')->find($Picklist->charge_order_id);
				if (!$chargeOrder) {
					throw new \Exception('Charge Order not found.');
				}

				$uuid = $this->get_uuid();
				$document = DocumentType::getNextDocument($this->document_type_id, $request);

				$data = [
					'sale_return_id' => $uuid,
					'company_id' => $request->company_id ?? '',
					'company_branch_id' => $request->company_branch_id ?? '',
					'document_type_id' => $document['document_type_id'] ?? '',
					'document_no' => $document['document_no'] ?? '',
					'document_prefix' => $document['document_prefix'] ?? '',
					'document_identity' => $document['document_identity'] ?? '',
					'document_date' => $newObj['document_date'] ?? Carbon::now(),
					'ship_to' => $newObj['ship_to'] ?? '',
					'ship_via' => $newObj['ship_via'] ?? '',
					'return_date' => $newObj['return_date'] ?? '',
					'charge_order_id' => $Picklist->charge_order_id,
					'picklist_id' => $newObj['picklist_id'],
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id,
					'status' => $newObj['status'],
				];

				$totalQuantity = 0;
				$totalAmount = 0;
				$index = 0;

				if ($newObj['sale_return_detail']) {
					SaleReturn::create($data);

					foreach ($newObj['sale_return_detail'] as $detail) {
						$PicklistDetail = PicklistDetail::find($detail['picklist_detail_id']);
						$Picklist = Picklist::find($PicklistDetail->picklist_id);
						$chargeOrderDetail = ChargeOrderDetail::where('product_type_id', '!=', 1)->find($PicklistDetail->charge_order_detail_id);
						if (empty($chargeOrderDetail))
							continue;

						$Product = Product::with('unit')->find($chargeOrderDetail->product_id);
						$Warehouse = Warehouse::find($detail['warehouse_id']);

						$amount = $chargeOrderDetail->rate * $detail['quantity'];
						$totalQuantity += $detail['quantity'];
						$totalAmount += $amount;
						$detail_uuid = $this->get_uuid();
						SaleReturnDetail::create([
							'sale_return_detail_id' => $detail_uuid,
							'sale_return_id' => $uuid,
							'charge_order_detail_id' => $PicklistDetail->charge_order_detail_id,
							'picklist_detail_id' => $detail['picklist_detail_id'],
							'sort_order' => $index++,
							'product_id' => $chargeOrderDetail->product_id,
							'product_name' => $chargeOrderDetail->product_name,
							'product_description' => $chargeOrderDetail->product_description,
							'description' => $chargeOrderDetail->description,
							'unit_id' => $chargeOrderDetail->unit_id,
							'quantity' => $detail['quantity'],
							'warehouse_id' => $detail['warehouse_id'],
							'rate' => $chargeOrderDetail->rate,
							'amount' => $amount,
							'created_at' => Carbon::now(),
							'created_by' => $request->login_user_id,
						]);

						if ($Product->product_type_id == 2 && !empty($detail['warehouse_id']) && ($detail['quantity'] > 0)) {
							$stockEntry = [
								'sort_order' => $index,
								'product_id' => $chargeOrderDetail->product_id,
								'warehouse_id' => $detail['warehouse_id'],
								'unit_id' => $Product->unit_id ?? null,
								'unit_name' => $Product->unit->name ?? null,
								'quantity' => $detail['quantity'],
								'rate' => $chargeOrderDetail->rate,
								'amount' => $amount,
								'remarks' => sprintf(
									'%d %s of %s (Code: %s) returned in %s warehouse under Sale Return document %s. Original rate: %s. Total amount: %s.',
									$detail['quantity'] ?? 0,
									$Product->unit->name ?? '',
									$Product->name ?? 'Unknown Product',
									$Product->impa_code ?? 'N/A',
									$Warehouse->name ?? 'Unknown Warehouse',
									$Picklist->document_identity ?? 'N/A',
									$chargeOrderDetail->rate ?? 'N/A',
									$amount ?? '0.00'
								),
							];
							StockLedger::handleStockMovement([
								'sort_order' => $index,
								'master_model' => new SaleReturn,
								'document_id' => $uuid,
								'document_detail_id' => $detail_uuid,
								'row' => $stockEntry,
							], 'I');
						}
					}

					$saleReturn = SaleReturn::find($uuid);
					$saleReturn->total_quantity = $totalQuantity;
					$saleReturn->total_amount = $totalAmount;
					$saleReturn->save();
				}
			}

				DB::commit();
				return $this->jsonResponse(['sale_return_id' => $uuid], 200, 'Create Bulk Sale Returns Successfully!');
			
		} catch (\Exception $e) {
			DB::rollBack();
			return $this->jsonResponse('Error creating sale returns: ' . $e->getMessage(), 500);
		}
	}

	public function store(Request $request)
	{
		if (!isPermission('add', 'sale_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, 'No Permission');
		}

		$validationError = $this->validateRequest($request->all());
		if (!empty($validationError)) {
			return $this->jsonResponse($validationError, 400, 'Request Failed!');
		}

		try {
			DB::beginTransaction();

			$Picklist = Picklist::find($request->picklist_id);
			if (!$Picklist) {
				throw new \Exception('Picklist not found.');
			}

			$chargeOrder = ChargeOrder::with('charge_order_detail')->find($Picklist->charge_order_id);
			if (!$chargeOrder) {
				throw new \Exception('Charge Order not found.');
			}

			$uuid = $this->get_uuid();
			$document = DocumentType::getNextDocument($this->document_type_id, $request);

			$data = [
				'sale_return_id' => $uuid,
				'company_id' => $request->company_id ?? '',
				'company_branch_id' => $request->company_branch_id ?? '',
				'document_type_id' => $document['document_type_id'] ?? '',
				'document_no' => $document['document_no'] ?? '',
				'document_prefix' => $document['document_prefix'] ?? '',
				'document_identity' => $document['document_identity'] ?? '',
				'document_date' => $request->document_date ?? Carbon::now(),
				'ship_to' => $request->ship_to ?? '',
				'ship_via' => $request->ship_via ?? '',
				'return_date' => $request->return_date ?? '',
				'charge_order_id' => $Picklist->charge_order_id,
				'picklist_id' => $request->picklist_id,
				'created_at' => Carbon::now(),
				'created_by' => $request->login_user_id,
				'status' => $request->status,
			];

			$totalQuantity = 0;
			$totalAmount = 0;
			$index = 0;

			if ($request->sale_return_detail) {
				SaleReturn::create($data);

				foreach ($request->sale_return_detail as $detail) {
					$PicklistDetail = PicklistDetail::find($detail['picklist_detail_id']);
					$Picklist = Picklist::find($PicklistDetail->picklist_id);
					$chargeOrderDetail = ChargeOrderDetail::where('product_type_id', '!=', 1)->find($PicklistDetail->charge_order_detail_id);
					if (empty($chargeOrderDetail))
						continue;

					$Product = Product::with('unit')->find($chargeOrderDetail->product_id);
					$Warehouse = Warehouse::find($detail['warehouse_id']);

					$amount = $chargeOrderDetail->rate * $detail['quantity'];
					$totalQuantity += $detail['quantity'];
					$totalAmount += $amount;
					$detail_uuid = $this->get_uuid();
					SaleReturnDetail::create([
						'sale_return_detail_id' => $detail_uuid,
						'sale_return_id' => $uuid,
						'charge_order_detail_id' => $PicklistDetail->charge_order_detail_id,
						'picklist_detail_id' => $detail['picklist_detail_id'],
						'sort_order' => $index++,
						'product_id' => $chargeOrderDetail->product_id,
						'product_name' => $chargeOrderDetail->product_name,
						'product_description' => $chargeOrderDetail->product_description,
						'description' => $chargeOrderDetail->description,
						'unit_id' => $chargeOrderDetail->unit_id,
						'quantity' => $detail['quantity'],
						'warehouse_id' => $detail['warehouse_id'],
						'rate' => $chargeOrderDetail->rate,
						'amount' => $amount,
						'created_at' => Carbon::now(),
						'created_by' => $request->login_user_id,
					]);

					if ($Product->product_type_id == 2 && !empty($detail['warehouse_id']) && ($detail['quantity'] > 0)) {
						$stockEntry = [
							'sort_order' => $index,
							'product_id' => $chargeOrderDetail->product_id,
							'warehouse_id' => $detail['warehouse_id'],
							'unit_id' => $Product->unit_id ?? null,
							'unit_name' => $Product->unit->name ?? null,
							'quantity' => $detail['quantity'],
							'rate' => $chargeOrderDetail->rate,
							'amount' => $amount,
							'remarks' => sprintf(
								'%d %s of %s (Code: %s) returned in %s warehouse under Sale Return document %s. Original rate: %s. Total amount: %s.',
								$detail['quantity'] ?? 0,
								$Product->unit->name ?? '',
								$Product->name ?? 'Unknown Product',
								$Product->impa_code ?? 'N/A',
								$Warehouse->name ?? 'Unknown Warehouse',
								$Picklist->document_identity ?? 'N/A',
								$chargeOrderDetail->rate ?? 'N/A',
								$amount ?? '0.00'
							),
						];
						StockLedger::handleStockMovement([
							'sort_order' => $index,
							'master_model' => new SaleReturn,
							'document_id' => $uuid,
							'document_detail_id' => $detail_uuid,
							'row' => $stockEntry,
						], 'I');
					}
				}

				$saleReturn = SaleReturn::find($uuid);
				$saleReturn->total_quantity = $totalQuantity;
				$saleReturn->total_amount = $totalAmount;
				$saleReturn->save();
			}

			if ($totalQuantity > 0) {
				DB::commit();
				return $this->jsonResponse(['sale_return_id' => $uuid], 200, 'Add Sale Return Successfully!');
			} else {
				DB::rollBack();
				return $this->jsonResponse(['sale_return_id' => $uuid], 500, 'Cannot generate Return: No items with available quantity.');
			}
		} catch (\Exception $e) {
			DB::rollBack();
			return $this->jsonResponse('Error creating sale return: ' . $e->getMessage(), 500);
		}
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'sale_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, 'No Permission');
		}

		$validationError = $this->validateRequest($request->all());
		if (!empty($validationError)) {
			return $this->jsonResponse($validationError, 400, 'Request Failed!');
		}

		try {
			DB::beginTransaction();

			$saleReturn = SaleReturn::find($id);
			if (!$saleReturn) {
				throw new \Exception('Sale Return not found.');
			}

			$Picklist = Picklist::find($request->picklist_id);
			if (!$Picklist) {
				throw new \Exception('Picklist not found.');
			}

			$saleReturn->document_date = $request->document_date ?? $saleReturn->document_date;
			$saleReturn->updated_at = Carbon::now();
			$saleReturn->updated_by = $request->login_user_id;
			$saleReturn->ship_to = $request->ship_to ?? "";
			$saleReturn->ship_via = $request->ship_via ?? "";
			$saleReturn->return_date = $request->return_date ?? "";
			$saleReturn->status = $request->status;
			$saleReturn->save();

			$totalQuantity = 0;
			$totalAmount = 0;
			$index = 0;

			if ($request->sale_return_detail) {
				foreach ($request->sale_return_detail as $detail) {
					$PicklistDetail = PicklistDetail::find($detail['picklist_detail_id']);
					$Picklist = Picklist::find($PicklistDetail->picklist_id);
					$chargeOrderDetail = ChargeOrderDetail::where('product_type_id', '!=', 1)->find($PicklistDetail->charge_order_detail_id);
					if (empty($chargeOrderDetail))
						continue;

					$Product = Product::with('unit')->find($chargeOrderDetail->product_id);
					$Warehouse = Warehouse::find($detail['warehouse_id']);
					$index++;

					if ($detail['row_status'] == 'I') {
						$amount = $chargeOrderDetail->rate * $detail['quantity'];
						$totalQuantity += $detail['quantity'];
						$totalAmount += $amount;

						$detail_uuid = $this->get_uuid();
						SaleReturnDetail::create([
							'sale_return_detail_id' => $detail_uuid,
							'sale_return_id' => $id,
							'charge_order_detail_id' => $PicklistDetail->charge_order_detail_id,
							'picklist_detail_id' => $detail['picklist_detail_id'],
							'sort_order' => $index,
							'product_id' => $chargeOrderDetail->product_id,
							'product_name' => $chargeOrderDetail->product_name,
							'product_description' => $chargeOrderDetail->product_description,
							'description' => $chargeOrderDetail->description,
							'unit_id' => $chargeOrderDetail->unit_id,
							'warehouse_id' => $detail['warehouse_id'],
							'quantity' => $detail['quantity'],
							'rate' => $chargeOrderDetail->rate,
							'amount' => $amount,
							'created_at' => Carbon::now(),
							'created_by' => $request->login_user_id,
						]);

						if ($Product->product_type_id == 2 && !empty($detail['warehouse_id']) && ($detail['quantity'] > 0)) {
							$stockEntry = [
								'sort_order' => $index,
								'product_id' => $chargeOrderDetail->product_id,
								'warehouse_id' => $detail['warehouse_id'],
								'unit_id' => $Product->unit_id ?? null,
								'unit_name' => $Product->unit->name ?? null,
								'quantity' => $detail['quantity'],
								'rate' => $chargeOrderDetail->rate,
								'amount' => $amount,
								'remarks' => sprintf(
									'%d %s of %s (Code: %s) returned in %s warehouse under Sale Return document %s. Original rate: %s. Total amount: %s.',
									$detail['quantity'] ?? 0,
									$Product->unit->name ?? '',
									$Product->name ?? 'Unknown Product',
									$Product->impa_code ?? 'N/A',
									$Warehouse->name ?? 'Unknown Warehouse',
									$Picklist->document_identity ?? 'N/A',
									$chargeOrderDetail->rate ?? 'N/A',
									$amount ?? '0.00'
								),
							];
							StockLedger::handleStockMovement([
								'sort_order' => $index,
								'master_model' => new SaleReturn,
								'document_id' => $id,
								'document_detail_id' => $detail_uuid,
								'row' => $stockEntry,
							], 'I');
						}
					}
					if ($detail['row_status'] == 'U') {
						$totalQuantity += $detail['quantity'];
						$totalAmount += $detail['amount'];
						$row = [
							'sort_order' => $detail['sort_order'] ?? '',
							'product_id' => $detail['product_id'] ?? '',
							'product_name' => $detail['product_name'] ?? '',
							'product_description' => $detail['product_description'] ?? '',
							'description' => $detail['description'] ?? '',
							'unit_id' => $detail['unit_id'] ?? '',
							'warehouse_id' => $detail['warehouse_id'] ?? '',
							'quantity' => $detail['quantity'] ?? '',
							'rate' => $detail['rate'] ?? '',
							'amount' => $detail['amount'] ?? '',
							'updated_at' => Carbon::now(),
							'updated_by' => $request->login_user_id,
						];
						SaleReturnDetail::where('sale_return_detail_id', $detail['sale_return_detail_id'])->update($row);
						StockLedger::where('document_detail_id', $detail['sale_return_detail_id'])->delete();

						if ($Product->product_type_id == 2 && !empty($detail['warehouse_id']) && ($detail['quantity'] > 0)) {
							$stockEntry = [
								'sort_order' => $index,
								'product_id' => $chargeOrderDetail->product_id,
								'warehouse_id' => $detail['warehouse_id'],
								'unit_id' => $Product->unit_id ?? null,
								'unit_name' => $Product->unit->name ?? null,
								'quantity' => $detail['quantity'],
								'rate' => $chargeOrderDetail->rate,
								'amount' => $detail['amount'],
								'remarks' => sprintf(
									'%d %s of %s (Code: %s) returned in %s warehouse under Sale Return document %s. Original rate: %s. Total amount: %s.',
									$detail['quantity'] ?? 0,
									$Product->unit->name ?? '',
									$Product->name ?? 'Unknown Product',
									$Product->impa_code ?? 'N/A',
									$Warehouse->name ?? 'Unknown Warehouse',
									$Picklist->document_identity ?? 'N/A',
									$chargeOrderDetail->rate ?? 'N/A',
									$detail['amount'] ?? '0.00'
								),
							];
							StockLedger::handleStockMovement([
								'sort_order' => $index,
								'master_model' => new SaleReturn,
								'document_id' => $id,
								'document_detail_id' => $detail['sale_return_detail_id'],
								'row' => $stockEntry,
							], 'I');
						}
					}
					if ($detail['row_status'] == 'D') {
						SaleReturnDetail::where('sale_return_detail_id', $detail['sale_return_detail_id'])->delete();
						StockLedger::where('document_detail_id', $detail['sale_return_detail_id'])->delete();
					}
				}

				$saleReturn->total_quantity = $totalQuantity;
				$saleReturn->total_amount = $totalAmount;
				$saleReturn->save();
			}

			DB::commit();
			return $this->jsonResponse(['sale_return_id' => $id], 200, 'Sale Return Updated Successfully!');
		} catch (\Exception $e) {
			DB::rollBack();
			return $this->jsonResponse('Error updating sale return: ' . $e->getMessage(), 500);
		}
	}

	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'sale_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403);
		}

		try {
			DB::beginTransaction();

			$data = SaleReturn::find($id);
			if (!$data) {
				throw new \Exception('Sale Return Not Found!');
			}

			$data->delete();
			SaleReturnDetail::where('sale_return_id', $id)->delete();
			StockLedger::where('document_id', $id)->delete();

			DB::commit();
			return $this->jsonResponse(['sale_return_id' => $id], 200, 'Sale Return Deleted Successfully!');
		} catch (\Exception $e) {
			DB::rollBack();
			return $this->jsonResponse('Error deleting sale return: ' . $e->getMessage(), 500);
		}
	}

	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'sale_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403);
		}

		try {
			$saleReturnIds = $request->sale_return_ids ?? [];
			if (empty($saleReturnIds)) {
				throw new \Exception('No Sale Return IDs provided');
			}

			$saleReturns = SaleReturn::whereIn('sale_return_id', $saleReturnIds)->get();
			$deletedCount = 0;

			foreach ($saleReturns as $saleReturn) {
				$saleReturn->delete();
				SaleReturnDetail::where('sale_return_id', $saleReturn->sale_return_id)->delete();
				StockLedger::where('document_id', $saleReturn->sale_return_id)->delete();
				$deletedCount++;
			}

			return $this->jsonResponse('Deleted', 200, "{$deletedCount} Sale Return(s) Deleted Successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('Error deleting sale returns: ' . $e->getMessage(), 500);
		}
	}
}
