<?php

namespace App\Http\Controllers;

use App\Models\SetupClass;
use App\Models\Vessel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ClassController extends Controller
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

		$data = new SetupClass;
		if (!empty($name)) $data = $data->where('name', 'like', '%' . $name . '%');
		$data = $data->where('company_id', '=', $request->company_id);

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
		$data = SetupClass::where('class_id', $id)->first();
		return $this->jsonResponse($data, 200, "Class Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('class')->ignore($id, 'class_id')->where('company_id', $request['company_id'])],
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

		if (!isPermission('add', 'class', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'class_id' => $uuid,
			'name' => $request->name ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$user = SetupClass::create($insertArr);

		return $this->jsonResponse(['class_id' => $uuid], 200, "Add Class Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'class', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = SetupClass::where('class_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->name  = $request->name ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;



		$data->update();


		return $this->jsonResponse(['class_id' => $id], 200, "Update Class Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'class', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = SetupClass::where('class_id', $id)->first();

		$req = [
			'main' => [
				'check' => new SetupClass,
				'id' => $id,
			],
			'with' => [
				['model' => new Vessel, "key" => ["class1_id", "class2_id"]],
			]
		];

		$res = $this->checkAndDelete($req);
		if ($res['error']) {
			return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
		}
		$data->delete();

		return $this->jsonResponse(['class_id' => $id], 200, "Delete Class Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'class', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->class_ids) && !empty($request->class_ids) && is_array($request->class_ids)) {
				foreach ($request->class_ids as $class_id) {
					$user = SetupClass::where(['class_id' => $class_id])->first();
					$req = [
						'main' => [
							'check' => new SetupClass,
							'id' => $class_id,
						],
						'with' => [
							['model' => new Vessel, "key" => ["class1_id", "class2_id"]],
						]
					];
					$res = $this->checkAndDelete($req);
					if ($res['error']) {
						return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
					}
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Class successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
