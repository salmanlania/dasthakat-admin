<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Validation\Rule;

class SubCategoryController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
		$category_id = $request->input('category_id', '');
		$name = $request->input('name', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'sub_category.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = SubCategory::LeftJoin('category as c', 'c.category_id', '=', 'sub_category.category_id');
		if (!empty($name)) $data = $data->where('sub_category.name', 'like', '%' . $name . '%');
		if (!empty($category_id)) $data = $data->where('sub_category.category_id', '=', $category_id);
		$data = $data->where('sub_category.company_id', '=', $request->company_id);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('sub_category.name', 'like', '%' . $search . '%')
					->orWhere('c.name', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("sub_category.*", "c.name as category_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{
		$data = SubCategory::LeftJoin('category as c', 'c.category_id', '=', 'sub_category.category_id')
			->select("sub_category.*", "c.name as category_name")
			->where('sub_category_id', $id)->first();
		return $this->jsonResponse($data, 200, "Sub Category Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'category_id' => ['required'],
			'name' => ['required', Rule::unique('sub_category')->ignore($id, 'sub_category_id')->where('company_id', $request['company_id'])],
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

		if (!isPermission('add', 'sub_category', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'sub_category_id' => $uuid,
			'category_id' => $request->category_id ?? "",
			'name' => $request->name ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$user = SubCategory::create($insertArr);

		return $this->jsonResponse(['sub_category_id' => $uuid], 200, "Add Sub Category Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'sub_category', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = SubCategory::where('sub_category_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->category_id  = $request->category_id ?? "";
		$data->name  = $request->name ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;



		$data->update();


		return $this->jsonResponse(['sub_category_id' => $id], 200, "Update Sub Category Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'sub_category', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = SubCategory::where('sub_category_id', $id)->first();

		$req = [
			'main' => [
				'check' => new SubCategory,
				'id' => $id,
			],
			'with' => [
				['model' => new Product],
			]
		];

		$res = $this->checkAndDelete($req);
		if ($res['error']) {
			return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
		}
		$data->delete();

		return $this->jsonResponse(['sub_category_id' => $id], 200, "Delete Sub Category Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'sub_category', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->sub_category_ids) && !empty($request->sub_category_ids) && is_array($request->sub_category_ids)) {
				foreach ($request->sub_category_ids as $sub_category_id) {
					$user = SubCategory::where(['sub_category_id' => $sub_category_id])->first();
					$req = [
						'main' => [
							'check' => new SubCategory,
							'id' => $sub_category_id,
						],
						'with' => [
							['model' => new Product],
						]
					];

					$res = $this->checkAndDelete($req);
					if ($res['error']) {
						return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
					}
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Sub Category successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
