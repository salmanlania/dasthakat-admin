<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{

	public function index(Request $request)
	{
		$name = $request->input('name', '');
		$product_type_id = $request->input('product_type_id', '');
		$unit_id = $request->input('unit_id', '');
		$product_code = $request->input('product_code', '');
		$category_id = $request->input('category_id', '');
		$brand_id = $request->input('brand_id', '');
		$sub_category_id = $request->input('sub_category_id', '');
		$impa_code = $request->input('impa_code', '');
		$sale_price = $request->input('sale_price', '');
		$cost_price = $request->input('cost_price', '');
		$status = $request->input('status', '');
		$all = $request->input('all', '');
		$includeStock = filter_var($request->input('stock', false), FILTER_VALIDATE_BOOLEAN);

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'product.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$query = Product::leftJoin('category as c', 'c.category_id', '=', 'product.category_id')
			->leftJoin('sub_category as sc', 'sc.sub_category_id', '=', 'product.sub_category_id')
			->leftJoin('product_type as pt', 'pt.product_type_id', '=', 'product.product_type_id')
			->leftJoin('unit as u', 'u.unit_id', '=', 'product.unit_id')
			->leftJoin('brand as b', 'b.brand_id', '=', 'product.brand_id');
			$query->where('product.company_id', '=', $request->company_id);
			$query->where('product.company_branch_id', '=', $request->company_branch_id);
	
		if (!empty($name)) $query->where('product.name', 'like', '%' . $name . '%');
		if (!empty($impa_code)) $query->where('product.impa_code', 'like', '%' . $impa_code . '%');
		if (!empty($product_type_id)) $query->where('product.product_type_id', $product_type_id);
		if (!empty($unit_id)) $query->where('product.unit_id', $unit_id);
		if (!empty($category_id)) $query->where('product.category_id', $category_id);
		if (!empty($sub_category_id)) $query->where('product.sub_category_id', $sub_category_id);
		if (!empty($brand_id)) $query->where('product.brand_id', $brand_id);
		if (!empty($sale_price)) $query->where('product.sale_price', 'like', '%' . $sale_price . '%');
		if (!empty($cost_price)) $query->where('product.cost_price', 'like', '%' . $cost_price . '%');
		if ($all != 1) $query->where('product.status', '=', 1);
		if ($status !== "") $query->where('product.status', '=', $status);
		if (!empty($product_code)) $query->where('product.product_code', '=',  $product_code)->orWhere('product.impa_code', '=', $product_code);
		
		if (!empty($search)) {
			$query->where(function ($query) use ($search) {
				$query->where('product.name', 'like', '%' . $search . '%')
					->orWhere('pt.name', 'like', '%' . $search . '%')
					->orWhere('c.name', 'like', '%' . $search . '%')
					->orWhere('u.name', 'like', '%' . $search . '%')
					->orWhere('sc.name', 'like', '%' . $search . '%')
					->orWhere('b.name', 'like', '%' . $search . '%')
					->orWhere('product.product_type_id', 'like', '%' . $search . '%')
					->orWhere('product.product_code', 'like', '%' . $search . '%')
					->orWhere('product.impa_code', 'like', '%' . $search . '%');
			});
		}

		$query->select(
			'product.*',
			"pt.name as product_type_name",
			'c.name as category_name',
			'sc.name as sub_category_name',
			'b.name as brand_name',
			'u.name as unit_name',
			DB::raw("CONCAT(product.impa_code, ' ', product.name) as product_name")
		);

		$query->orderBy($sort_column, $sort_direction);
		$products = $query->paginate($perPage, ['*'], 'page', $page);

		// If stock key is true, add stock information
		if ($includeStock) {
			foreach ($products as $product) {
				$data = StockLedger::Check($product, $request->all());
				$product->stock = $data;
			}
		}

		return response()->json($products);
	}



	public function show($id, Request $request)
	{
		$product = Product::leftJoin('category as c', 'c.category_id', '=', 'product.category_id')
			->LeftJoin('sub_category as sc', 'sc.sub_category_id', '=', 'product.sub_category_id')
			->LeftJoin('unit as u', 'u.unit_id', '=', 'product.unit_id')
			->LeftJoin('product_type as pt', 'pt.product_type_id', '=', 'product.product_type_id')
			->LeftJoin('brand as b', 'b.brand_id', '=', 'product.brand_id');

		$product = $product->where('product.product_id', $id);
		$product = $product->select('product.*', 'pt.product_type_id', 'pt.name as product_type_name', 'c.name as category_name', 'sc.name as sub_category_name', 'b.name as brand_name', 'u.name as unit_name')->first();
		$product['image_url']  = !empty($product['image']) ?  url('public/uploads/' . $product['image']) : '';

		$data = StockLedger::Check($product, $request->all());
		$product->stock = $data;

		return $this->jsonResponse($product, 200, "Product Data");
	}
	public function getProductByCode($code)
	{
		$product = Product::leftJoin('category as c', 'c.category_id', '=', 'product.category_id')
			->LeftJoin('sub_category as sc', 'sc.sub_category_id', '=', 'product.sub_category_id')
			->LeftJoin('unit as u', 'u.unit_id', '=', 'product.unit_id')
			->LeftJoin('brand as b', 'b.brand_id', '=', 'product.brand_id');

		$product = $product->where('product.product_code', $code);
		$product = $product->select('product.*', 'c.name as category_name', 'sc.name as sub_category_name', 'b.name as brand_name', 'u.name as unit_name')->first();
		$product['image_url']  = !empty($product['image']) ?  url('public/uploads/' . $product['image']) : '';
		return $this->jsonResponse($product, 200, "Product Data");
	}

	public function Validator($request, $id = null)
	{
		$rules = [
			'unit_id' => 'required',
			'product_type_id' => 'required',
			'name' => [
				'required',
				Rule::unique('product')->ignore($id, 'product_id')->where('company_id', $request->company_id)
			],
			'impa_code' => [
				Rule::unique('product')->ignore($id, 'product_id')->where('company_id', $request->company_id)
			]
		];

		$msg = validateRequest($request, $rules);
		if (!empty($msg)) return $msg;
	}

	public function store(Request $request)
	{
		$data = $request->all();

		// Validation Rules
		$isError = $this->Validator($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");
		$imageData = $data['image'] ?? "";
		$image = "";
		if (isset($imageData) && !empty($imageData))
			$image = $this->base64ToImage($imageData);

		$uuid = $this->get_uuid();
		$maxCode = Product::where('company_id', $request->company_id)
			->where('company_branch_id', $request->company_branch_id)
			->max('product_no');

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'product_id' => $uuid,
			'product_type_id' => $request->product_type_id ?? "",
			'product_code' => str_pad($maxCode + 1, 4, '0', STR_PAD_LEFT),
			'product_no' => $maxCode + 1,
			'name' => $request->name,
			'impa_code' => $request->impa_code ?? "",
			'category_id' => $request->category_id ?? "",
			'sub_category_id' => $request->sub_category_id ?? "",
			'brand_id' => $request->brand_id ?? "",
			'unit_id' => $request->unit_id ?? "",
			'cost_price' => $request->cost_price ?? "",
			'sale_price' => $request->sale_price ?? "",
			'status' => $request->status,
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		if (isset($imageData) && !empty($imageData))
			$insertArr['image'] =  $image;

		Product::create($insertArr);
		return $this->jsonResponse(['product_id' => $uuid], 200, "Add Product Successfully!");
	}


	public function update($id, Request $request)
	{
		$product  = Product::where('product_id', $id)->first();
		if (empty($product)) return $this->jsonResponse(['product_id' => $id], 404, "Product Not Found!");


		// Validation Rules
		$isError = $this->Validator($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data      = $request->all();
		$imageData = $data['image'];
		$image = "";
		if (isset($imageData) && !empty($imageData))
			$image = $this->base64ToImage($imageData);


		$product->company_id  = $request->company_id;
		$product->company_branch_id  = $request->company_branch_id;
		$product->product_type_id  = $request->product_type_id ?? "";
		$product->product_code  = $request->product_code ?? "";
		$product->product_no  = $request->product_no ?? "";
		$product->name  = $request->name ?? "";
		$product->impa_code  = $request->impa_code ?? "";
		$product->unit_id  = $request->unit_id ?? "";
		$product->category_id  = $request->category_id ?? "";
		$product->sub_category_id  = $request->sub_category_id ?? "";
		$product->brand_id  = $request->brand_id ?? "";
		$product->cost_price  = $request->cost_price ?? "";
		$product->sale_price  = $request->sale_price ?? "";
		$product->status  = $request->status ?? "";
		$product->updated_at  = date('Y-m-d H:i:s');
		$product->updated_by  = $request->login_user_id ?? "";

		if (deleteFile($request->delete_image)) {
			$product->image = null;
		}
		if (isset($imageData) && !empty($imageData)) {
			$product->image = $image;
		}

		$product->update();

		return $this->jsonResponse(['product_id' => $id], 200, "Update Product Successfully!");
	}


	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'product', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		$product = Product::where('product_id', $id)->first();
		if (!$product) {
			return $this->jsonResponse(['product_id' => $id], 404, "Product Not Found!");
		}
		deleteFile($product->image);
		$product->delete();

		return $this->jsonResponse(['product_id' => $id], 200, "Product deleted successfully!");
	}
	public function bulkDelete(Request $request)
	{

		if (!isPermission('delete', 'product', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->product_ids) && !empty($request->product_ids) && is_array($request->product_ids)) {
				foreach ($request->product_ids as $product_id) {
					$product = Product::where('product_id', $product_id)->first();
					deleteFile($product->image);
					$product->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Product Successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
