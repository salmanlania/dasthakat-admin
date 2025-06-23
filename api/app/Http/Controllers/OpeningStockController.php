<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\DocumentType;
use App\Models\OpeningStock;
use App\Models\OpeningStockDetail;
use App\Models\Product;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseOrder;
use App\Models\StockLedger;
use App\Models\Warehouse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OpeningStockController extends Controller
{
	protected $document_type_id = 55;
	protected $db;

	public function index(Request $request)
	{
		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
	
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = OpeningStock::query();
		$data = $data->where('company_id', '=', $request->company_id);
		$data = $data->where('company_branch_id', '=', $request->company_branch_id);
		if (!empty($document_identity)) $data = $data->where('document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('document_date', '=',  $document_date);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->Where('document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("*");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = OpeningStock::with(
			"opening_stock_detail",
			"opening_stock_detail.product",
			"opening_stock_detail.product_type",
			"opening_stock_detail.warehouse",
			"opening_stock_detail.unit",
		)
			->where('opening_stock_id', $id)->first();

		return $this->jsonResponse($data, 200, "Opening Stock Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			
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
		// return $request->all();
		if (!isPermission('add', 'opening_stock', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
		DB::beginTransaction();
		try{
		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'opening_stock_id' => $uuid,
			'document_type_id' => $document['document_type_id'] ?? "",
			'document_no' => $document['document_no'] ?? "",
			'document_prefix' => $document['document_prefix'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_date' => $request->document_date ?? "",
			'remarks' => $request->remarks ?? "",
			'total_quantity' => $request->total_quantity ?? "",
			'total_amount' => $request->total_amount ?? "",
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		];
		OpeningStock::create($insertArr);

		if ($request->opening_stock_detail) {
			foreach ($request->opening_stock_detail as $value) {
				$product = Product::with('unit')->where('product_id', $value['product_id'])->first();
				$warehouse = Warehouse::where('warehouse_id', $value['warehouse_id'])->first();
				$detail_uuid = $this->get_uuid();
				$insert = [
					'opening_stock_id' => $insertArr['opening_stock_id'],
					'opening_stock_detail_id' => $detail_uuid,
					'sort_order' => $value['sort_order'] ?? "",
					'product_type_id' => $value['product_type_id'] ?? "",
					'product_id' => $value['product_id'] ?? "",
					'product_name' => $value['product_name'] ?? "",
					'product_description' => $value['product_description'] ?? "",
					'description' => $value['description'] ?? "",
					'warehouse_id' => $value['warehouse_id'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					"document_currency_id" => $value['document_currency_id'] ?? "",
					"base_currency_id" => $base_currency_id ?? "",
					"unit_conversion" => $value['unit_conversion'] ?? 1,
					"currency_conversion" => $value['currency_conversion'] ?? 1,
					'quantity' => $value['quantity'] ?? 0,
					'rate' => $value['rate'] ?? 0,
					'amount' => $value['amount'] ?? 0,
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id,
				];
				if ($value['product_type_id'] == 2 && !empty($value['warehouse_id'])) {

					$value['unit_id'] = $product->unit_id ?? null;
					$value['unit_name'] = $product->unit->name ?? null;
					$value['remarks'] = sprintf(
						"%d %s of %s (Code: %s) added in %s warehouse under Opening Stock Document: %s",
						$value['quantity'] ?? 0,
						$value['unit_name'] ?? '',
						$product->name ?? 'Unknown Product',
						$product->impa_code ?? 'N/A',
						$warehouse['name'] ?? 'Unknown Warehouse',
						$document['document_identity'] ?? ''
					);
					StockLedger::handleStockMovement([
						'master_model' => new OpeningStock,
						'document_id' => $uuid,
						'document_detail_id' => $detail_uuid,
						'row' => $value,
					], 'I');
				}

				OpeningStockDetail::create($insert);
			}
		}

		DB::commit();
		return $this->jsonResponse(['opening_stock_id' => $uuid], 200, "Add Opening Stock Successfully!");
	} catch (\Exception $e) {
		DB::rollBack(); // Rollback on error
		Log::error('Opening Stock Store Error: ' . $e->getMessage());
		return $this->jsonResponse("Something went wrong while saving Opening Stock.", 500, "Transaction Failed");
	}
	}

	public function storeExcel(Request $request)
	{
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$base_currency_id = Company::where('company_id', $request->company_id ?? "")->pluck('base_currency_id')->first();

		DB::beginTransaction();
		try {
			$inputFile = $request->file('excel_file');
			$spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($inputFile->getPathname());
			$worksheet = $spreadsheet->getActiveSheet();

			$row = 1;
			$items = [];

			while ($worksheet->getCell('A' . $row)->getValue() != '') {
				$product_code = $worksheet->getCell('A' . $row)->getValue();
				$quantity = $worksheet->getCell('B' . $row)->getValue();
				$rate = $worksheet->getCell('C' . $row)->getValue();

				$product = Product::with('unit')
					->where('product_code', $product_code)
					->where('product_type_id', 2)
					->first();

				if ($product) {
					$items[] = [
						'product' => $product,
						'product_code' => $product_code,
						'quantity' => $quantity,
						'rate' => $rate,
						'amount' => $quantity * $rate,
					];
				}

				$row++;
			}

			$uuid = $this->get_uuid();
			$document = DocumentType::getNextDocument($this->document_type_id, $request);

			$openingData = [
				'company_id' => $request->company_id ?? "",
				'company_branch_id' => $request->company_branch_id ?? "",
				'opening_stock_id' => $uuid,
				'document_type_id' => $document['document_type_id'] ?? "",
				'document_no' => $document['document_no'] ?? "",
				'document_prefix' => $document['document_prefix'] ?? "",
				'document_identity' => $document['document_identity'] ?? "",
				'document_date' => $request->document_date ?? Carbon::now(),
				'remarks' => $request->remarks ?? "",
				'created_at' => Carbon::now(),
				'created_by' => $request->login_user_id ?? "",
			];

			OpeningStock::create($openingData);

			$total_quantity = 0;
			$total_amount = 0;
			$sort_order = 1;

			foreach ($items as $item) {
				$product = $item['product'];
				$detail_uuid = $this->get_uuid();

				$detail = [
					'opening_stock_id' => $uuid,
					'opening_stock_detail_id' => $detail_uuid,
					'sort_order' => $sort_order++,
					'product_type_id' => $product->product_type_id,
					'product_id' => $product->product_id,
					'product_name' => $product->name,
					'product_description' => $product->name,
					'warehouse_id' => $request->warehouse_id ?? "",
					'unit_id' => $product->unit_id,
					'document_currency_id' => $base_currency_id,
					'base_currency_id' => $base_currency_id,
					'unit_conversion' => 1,
					'currency_conversion' => 1,
					'quantity' => $item['quantity'],
					'rate' => $item['rate'],
					'amount' => $item['amount'],
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id ?? "",
				];

				OpeningStockDetail::create($detail);

				$total_quantity += $item['quantity'];
				$total_amount += $item['amount'];

				if ($product->product_type_id == 2 && !empty($request->warehouse_id ?? "")) {
					StockLedger::handleStockMovement([
						'master_model' => new OpeningStock,
						'document_id' => $uuid,
						'document_detail_id' => $detail_uuid,
						'row' => array_merge($detail, [
							'unit_name' => $product->unit->name ?? null,
							'remarks' => sprintf(
								"%d %s of %s (Code: %s) added in warehouse under Opening Stock Document: %s",
								$item['quantity'],
								$product->unit->name ?? '',
								$product->name,
								$item['product_code'],
								$document['document_identity'] ?? ''
							)
						]),
					], 'I');
				}
			}

			// Update totals
			OpeningStock::where('opening_stock_id', $uuid)->update([
				'total_quantity' => $total_quantity,
				'total_amount' => $total_amount,
			]);

			DB::commit();

			return $this->jsonResponse([
				'opening_stock_id' => $uuid,
				'document_identity' => $document['document_identity'] ?? '',
				'total_quantity' => $total_quantity,
				'total_amount' => $total_amount,
			], 200, "Opening Stock Imported Successfully!");
		} catch (\Exception $e) {
			DB::rollBack();
			Log::error('Opening Stock Excel Import Error: ' . $e->getMessage());
			return $this->jsonResponse("Error: " . $e->getMessage(), 500, "Transaction Failed");
		}
	}



	public function update(Request $request, $id)
	{
		// return $request->all();
		if (!isPermission('edit', 'opening_stock', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$base_currency_id = Company::where('company_id', $request->company_id)->pluck('base_currency_id')->first();
		DB::beginTransaction();
		try{
	
		$data  = OpeningStock::where('opening_stock_id', $id)->first();
		$data->company_id = $request->company_id;
		$data->company_branch_id = $request->company_branch_id;
		$data->document_date = $request->document_date;
		$data->remarks = $request->remarks;
		$data->total_quantity = $request->total_quantity;
		$data->total_amount = $request->total_amount;
		$data->updated_at = Carbon::now();
		$data->updated_by = $request->login_user_id;
		$data->update();

		if ($request->opening_stock_detail) {

			foreach ($request->opening_stock_detail as $value) {
				if ($value['row_status'] == 'I') {

					$detail_uuid = $this->get_uuid();

					$insert = [
						'opening_stock_id' => $id,
						'opening_stock_detail_id' => $detail_uuid,
						'sort_order' => $value['sort_order'] ?? 0,
						'product_type_id' => $value['product_type_id'] ?? "",
						'product_id' => $value['product_id'] ?? "",
						'product_name' => $value['product_name'] ?? "",
						'product_description' => $value['product_description'] ?? "",
						'description' => $value['description'] ?? "",
						'warehouse_id' => $value['warehouse_id'] ?? "",
						'unit_id' => $value['unit_id'] ?? "",
						"document_currency_id" => $value['document_currency_id'] ?? "",
						"base_currency_id" => $base_currency_id ?? "",
						"unit_conversion" => $value['unit_conversion'] ?? 1,
						"currency_conversion" => $value['currency_conversion'] ?? 1,
						'quantity' => $value['quantity'] ?? "",
						'rate' => $value['rate'] ?? "",
						'amount' => $value['amount'] ?? "",
						'created_at' => Carbon::now(),
						'created_by' => $request->login_user_id,
					];
					if ($value['product_type_id'] == 2 && !empty($value['warehouse_id'])) {
						StockLedger::handleStockMovement([
							'master_model' => new OpeningStock,
							'document_id' => $id,
							'document_detail_id' => $detail_uuid,
							'row' => $value,
						], 'I');
					}
					OpeningStockDetail::create($insert);
				}
				if ($value['row_status'] == 'U') {

					$update = [

						'sort_order' => $value['sort_order'] ?? 0,
						'product_type_id' => $value['product_type_id'] ?? "",
						'product_id' => $value['product_id'] ?? "",
						'product_name' => $value['product_name'] ?? "",
						'product_description' => $value['product_description'] ?? "",
						'description' => $value['description'] ?? "",
						'warehouse_id' => $value['warehouse_id'] ?? "",
						'unit_id' => $value['unit_id'] ?? "",
						"document_currency_id" => $value['document_currency_id'] ?? "",
						"base_currency_id" => $base_currency_id ?? "",
						"unit_conversion" => $value['unit_conversion'] ?? 1,
						"currency_conversion" => $value['currency_conversion'] ?? 1,
						'quantity' => $value['quantity'] ?? "",
						'rate' => $value['rate'] ?? "",
						'amount' => $value['amount'] ?? "",
						'created_at' => Carbon::now(),
						'created_by' => $request->login_user_id,
					];
					if ($value['product_type_id'] == 2 && !empty($value['warehouse_id'])) {
						StockLedger::where('document_detail_id', $value['opening_stock_detail_id'])->delete();
						StockLedger::handleStockMovement([
							'master_model' => new OpeningStock,
							'document_id' => $id,
							'document_detail_id' => $value['opening_stock_detail_id'],
							'row' => $value,
						], 'I');
					}
					OpeningStockDetail::where('opening_stock_detail_id', $value['opening_stock_detail_id'])->update($update);
				}
				if ($value['row_status'] == 'D') {
					OpeningStockDetail::where('opening_stock_detail_id', $value['opening_stock_detail_id'])->delete();
					StockLedger::where('document_detail_id', $value['opening_stock_detail_id'])->delete();
				}
			}
		}

		DB::commit();
		return $this->jsonResponse(['opening_stock_id' => $id], 200, "Update Opening Stock Successfully!");
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Opening Stock Updated Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while updating Opening Stock.", 500, "Transaction Failed");
		}
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'opening_stock', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = OpeningStock::where('opening_stock_id', $id)->first();
		if (!$data) return $this->jsonResponse(['opening_stock_id' => $id], 404, "Opening Stock Not Found!");

		$data->delete();
		OpeningStockDetail::where('opening_stock_id', $id)->delete();
		StockLedger::where('document_id', $id)->delete();
		return $this->jsonResponse(['opening_stock_id' => $id], 200, "Delete Opening Stock Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'opening_stock', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->opening_stock_ids) && !empty($request->opening_stock_ids) && is_array($request->opening_stock_ids)) {
				foreach ($request->opening_stock_ids as $opening_stock_id) {
					$data = OpeningStock::where(['opening_stock_id' => $opening_stock_id])->first();

					$data->delete();
					OpeningStockDetail::where('opening_stock_id', $opening_stock_id)->delete();
					StockLedger::where('document_id', $opening_stock_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Opening Stock successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
