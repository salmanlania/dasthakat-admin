<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Warehouse;
use App\Models\Vessel;
use Illuminate\Validation\Rule;

class WarehouseController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
		$name = $request->input('name', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = new Warehouse;
		if (!empty($name)) $data = $data->where('name', 'like', '%' . $name . '%');
		$data = $data->where('company_id', '=', $request->company_id);
		$data = $data->where('company_branch_id', '=', $request->company_branch_id);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('name', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("*");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{
		$data = Warehouse::where('warehouse_id', $id)->first();
		return $this->jsonResponse($data, 200, "Warehouse Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('warehouse')->ignore($id, 'warehouse_id')->where('company_id', $request['company_id'])],
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

		if (!isPermission('add', 'warehouse', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'warehouse_id' => $uuid,
			'name' => $request->name ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		$user = Warehouse::create($insertArr);


		$this->auditAction($request->all(), "Insert", "warehouse", "warehouse", $uuid, $request->name, $insertArr);

		return $this->jsonResponse(['warehouse_id' => $uuid], 200, "Add Warehouse Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'warehouse', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = Warehouse::where('warehouse_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->name  = $request->name ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;



		$data->update();
		$this->auditAction($request->all(), "Update", "warehouse", "warehouse", $id, $request->name, $data);

		return $this->jsonResponse(['warehouse_id' => $id], 200, "Update Warehouse Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'warehouse', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Warehouse::where('warehouse_id', $id)->first();
		$data->delete();

		return $this->jsonResponse(['warehouse_id' => $id], 200, "Delete Warehouse Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'warehouse', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->warehouse_ids) && !empty($request->warehouse_ids) && is_array($request->warehouse_ids)) {
				foreach ($request->warehouse_ids as $warehouse_id) {
					$user = Warehouse::where(['warehouse_id' => $warehouse_id])->first();
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Warehouse successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
