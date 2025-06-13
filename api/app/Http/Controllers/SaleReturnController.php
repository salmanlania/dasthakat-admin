<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\DocumentType;
use App\Models\Picklist;
use App\Models\PicklistDetail;
use App\Models\Product;
use App\Models\PurchaseReturn;
use App\Models\SaleInvoice;
use App\Models\SaleInvoiceDetail;
use App\Models\SaleReturn;
use App\Models\SaleReturnDetail;
use App\Models\StockLedger;
use App\Models\StockReturn;
use App\Models\Warehouse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SaleReturnController extends Controller
{
	protected $document_type_id = 53;

	public function index(Request $request)
	{
		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$charge_order_no = $request->input('charge_order_no', '');
		$sale_invoice_no = $request->input('sale_invoice_no', '');
		$quotation_no = $request->input('quotation_no', '');
		$event_id = $request->input('event_id', '');
		$vessel_id = $request->input('vessel_id', '');
		
		$search = $request->input('search', '');
		$page = $request->input('page', 1);
		$perPage = $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'sale_return.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = SaleReturn::
		LeftJoin('charge_order as co', 'co.charge_order_id', '=', 'sale_return.charge_order_id')
		->LeftJoin('quotation as q', 'q.document_identity', '=', 'co.ref_document_identity')
		->LeftJoin('event as e', 'e.event_id', '=', 'co.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'co.vessel_id')
			->LeftJoin('sale_invoice as si', 'si.sale_invoice_id', '=', 'sale_return.sale_invoice_id');

		$data = $data->where('sale_return.company_id', '=', $request->company_id);
		$data = $data->where('sale_return.company_branch_id', '=', $request->company_branch_id);

		if (!empty($quotation_no))
			$data = $data->where('q.document_identity', 'like', "%" . $quotation_no. '%');
		if (!empty($sale_invoice_no))
			$data = $data->where('si.document_identity', 'like', "%" . $sale_invoice_no. '%');
		if (!empty($charge_order_no))
			$data = $data->where('co.document_identity', 'like', '%' . $charge_order_no . '%');
		if (!empty($event_id))
			$data = $data->where('co.event_id', '=', $event_id);
		
		if (!empty($vessel_id))
			$data = $data->where('co.vessel_id', '=', $vessel_id);
		if (!empty($document_identity))
			$data = $data->where('sale_return.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date))
			$data = $data->where('sale_return.document_date', '=', $document_date);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->Where('co.document_identity', 'like', '%' . $search . '%')
					->OrWhere('si.document_identity', 'like', '%' . $search . '%')
					->OrWhere('q.document_identity', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('sale_return.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select('sale_return.*', 'q.document_identity as quotation_no', 'co.document_identity as charge_no', 'e.event_code', 'v.name as vessel_name', 'si.document_identity as sale_invoice_no');
		$data = $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{
		$data = SaleReturn::with(
			'sale_return_detail.charge_order_detail',
			'sale_return_detail.sale_invoice_detail',
			'sale_return_detail.product',
			'sale_return_detail.unit',
			'sale_invoice',
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
			'updated_by_user'
		)
			->where('sale_return_id', $id)
			->first();
			
			$purchase_return = PurchaseReturn::with(
				"purchase_return_detail.charge_order_detail",
				"purchase_return_detail.product",
				"purchase_return_detail.product.product_type",
				"purchase_return_detail.unit",
				"purchase_order",
				"purchase_order.user",
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
				"charge_order.quotation.term",
				"charge_order.quotation.payment",
			)
				->where('sale_return_id', $id)->first();

				   foreach ($purchase_return->purchase_return_detail as &$detail) {
						if (!empty($detail->product_id)) {
							$product = Product::with('product_type')->where('product_id', $detail->product_id)->first();
							$detail->product_type = $product->product_type ?? null;
							$detail->product_type_id = $product->product_type->product_type_id ?? null;
						} else {
							$detail->product_type = (object)[
								'product_type_id' => 4,
								'name' => "Others"
							];
							$detail->product_type_id = 4;

						}
					}

				$stock_return = StockReturn::with(
					'stock_return_detail.charge_order_detail',
					'stock_return_detail.picklist_detail',
					'stock_return_detail.product',
					'stock_return_detail.unit',
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

				$data->purchase_return = $purchase_return;
				$data->stock_return = $stock_return;

				foreach ($data->sale_return_detail as &$detail) {
					if (!empty($detail->product_id)) {
						$product = Product::with('product_type')->where('product_id', $detail->product_id)->first();
						$detail->product_type = $product->product_type ?? null;
						$detail->product_type_id = $product->product_type->product_type_id ?? null;
					} else {
						$detail->product_type = (object)[
							'product_type_id' => 4,
							'name' => "Others"
						];
						$detail->product_type_id = 4;	
					}
				}
			
		return $this->jsonResponse($data, 200, 'View Api Data');
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'sale_invoice_id' => ['required'],
			'sale_return_detail' => 'required|array',
			'sale_return_detail.*.sale_invoice_detail_id' => 'required',
			'sale_return_detail.*.quantity' => 'required|numeric|min:1',
		];

		$validator = Validator::make($request, $rules);
		if ($validator->fails()) {
			return $validator->errors()->first();
		}
		return [];
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

		DB::beginTransaction();
		try {

			$SaleInvoice = SaleInvoice::find($request->sale_invoice_id);
			if (!$SaleInvoice) {
				throw new \Exception('Sale Invoice not found.');
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
				'charge_order_id' => $SaleInvoice->charge_order_id,
				'sale_invoice_id' => $request->sale_invoice_id,
				'total_quantity' => $SaleInvoice->total_quantity,
				'total_amount' => $SaleInvoice->total_amount,
				'created_at' => Carbon::now(),
				'created_by' => $request->login_user_id,
			];
			SaleReturn::create($data);


			$totalQuantity = 0;
			$totalAmount = 0;
			$index = 0;

			if ($request->sale_return_detail) {

				foreach ($request->sale_return_detail as $detail) {
					$SaleInvoiceDetail = SaleInvoiceDetail::find($detail['sale_invoice_detail_id']);

					$amount = ($SaleInvoiceDetail->rate ?? 0) * $detail['quantity'];
					$totalQuantity += $detail['quantity'];
					$totalAmount += $amount;
					$detail_uuid = $this->get_uuid();
					SaleReturnDetail::create([
						'sale_return_detail_id' => $detail_uuid,
						'sale_return_id' => $uuid,
						'charge_order_detail_id' => $SaleInvoiceDetail->charge_order_detail_id,
						'sale_invoice_detail_id' => $detail['sale_invoice_detail_id'],
						'sort_order' => $index++,
						'product_id' => $SaleInvoiceDetail->product_id,
						'product_name' => $SaleInvoiceDetail->product_name,
						'product_description' => $SaleInvoiceDetail->product_description,
						'description' => $SaleInvoiceDetail->description,
						'unit_id' => $SaleInvoiceDetail->unit_id,
						'warehouse_id' => $detail['warehouse_id'] ?? '',
						'quantity' => $detail['quantity'],
						'rate' => $SaleInvoiceDetail->rate,
						'amount' => $amount,
						'created_at' => Carbon::now(),
						'created_by' => $request->login_user_id,
					]);
					
				}

				$saleReturn = SaleReturn::find($uuid);
				$saleReturn->total_quantity = $totalQuantity;
				$saleReturn->total_amount = $totalAmount;
				$saleReturn->save();
			}
			

			if ($totalQuantity > 0) {
				DB::commit();
				return $this->jsonResponse(['sale_return_id' => $uuid], 200, 'Sale Return Created Successfully!');
			} else {
				DB::rollBack();
				return $this->jsonResponse(['sale_return_id' => $uuid], 500, 'Cannot generate Sale Return: No items available quantity.');
			}
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Sale Return Store Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while saving Stock Return.", 500, "Transaction Failed");
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

		DB::beginTransaction();
		try {

			$saleReturn = SaleReturn::find($id);
			if (!$saleReturn) {
				throw new \Exception('Sale Return not found.');
			}

			

			$saleReturn->document_date = $request->document_date ?? $saleReturn->document_date;
			$saleReturn->updated_at = Carbon::now();
			$saleReturn->updated_by = $request->login_user_id;
			$saleReturn->save();

			$index = 0;

			if ($request->sale_return_detail) {
				foreach ($request->sale_return_detail as $detail) {
		
					$index++;

				
					if ($detail['row_status'] == 'U') {
				
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
						
					
						}
					}
				
				}
				$SaleInvoiceDetailIns = SaleReturnDetail::where('sale_return_id', $id);
				$saleReturn->total_quantity = $SaleInvoiceDetailIns->sum('quantity');
				$saleReturn->total_amount = $SaleInvoiceDetailIns->sum('amount');
				$saleReturn->save();
			

			DB::commit();
			return $this->jsonResponse(['sale_return_id' => $id], 200, 'Sale Return Updated Successfully!');
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Sale Return Updated Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while updating Sale Return.", 500, "Transaction Failed");
		}
	}

	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'sale_return', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403);
		}

		DB::beginTransaction();
		try {

			$data = SaleReturn::find($id);
			if (!$data) {
				throw new \Exception('Sale Return Not Found!');
			}

			$data->delete();
			SaleReturnDetail::where('sale_return_id', $id)->delete();

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
