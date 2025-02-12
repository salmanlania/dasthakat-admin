<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Salesman;
use Illuminate\Validation\Rule;

class SalesmanController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
		$name = $request->input('name', '');
		$commission_percentage = $request->input('commission_percentage', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = new Salesman;
		$data = $data->where('company_id', '=', $request->company_id);
		$data = $data->where('company_branch_id', '=', $request->company_branch_id);
		if (!empty($name)) $data = $data->where('name', 'like', '%' . $name . '%');
		if (!empty($commission_percentage)) $data = $data->where('commission_percentage', 'like', '%' . $commission_percentage . '%');

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('name', 'like', '%' . $search . '%')
					->orwhere('commission_percentage', 'like', '%' . $search . '%')
					->orWhere('created_at', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("*");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{
		$data = Salesman::where('salesman_id', $id)->first();
		return $this->jsonResponse($data, 200, "Salesman Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('salesman')->ignore($id, 'salesman_id')->where('company_id', $request['company_id'])],
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

		if (!isPermission('add', 'salesman', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'salesman_id' => $uuid,
			'name' => $request->name ?? "",
			'commission_percentage' => $request->commission_percentage ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];

		// return $insertArr ;
		$user = Salesman::create($insertArr);

		return $this->jsonResponse(['salesman_id' => $uuid], 200, "Add Salesman Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'salesman', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = Salesman::where('salesman_id', $id)->first();
		$data->company_id  = $request->company_id ?? "";
		$data->company_branch_id  = $request->company_branch_id ?? "";
		$data->commission_percentage  = $request->commission_percentage ?? "";
		$data->name  = $request->name ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;

		$data->update();


		return $this->jsonResponse(['salesman_id' => $id], 200, "Update Salesman Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'salesman', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Salesman::where('salesman_id', $id)->first();

		$req = [
			'main' => [
				'check' => new Salesman,
				'id' => $id,
			],
			'with' => [
				['model' => new Customer],
			]
		];

		$res = $this->checkAndDelete($req);
		if ($res['error']) {
			return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
		}
		$data->delete();

		return $this->jsonResponse(['salesman_id' => $id], 200, "Delete Salesman Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'salesman', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->salesman_ids) && !empty($request->salesman_ids) && is_array($request->salesman_ids)) {
				foreach ($request->salesman_ids as $salesman_id) {
					$user = Salesman::where(['salesman_id' => $salesman_id])->first();
					$req = [
						'main' => [
							'check' => new Salesman,
							'id' => $salesman_id,
						],
						'with' => [
							['model' => new Customer],
						],
					];

					$res = $this->checkAndDelete($req);
					if ($res['error']) {
						return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
					}
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Salesman successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
