<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Flag;
use App\Models\Vessel;
use Illuminate\Validation\Rule;

class FlagController extends Controller
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

		$data = new Flag;
		$data = $data->where('company_id', '=', $request->company_id);
		$data = $data->where('company_branch_id', '=', $request->company_branch_id);
		if (!empty($name)) $data = $data->where('name', 'like', '%' . $name . '%');

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
		$data = Flag::where('flag_id', $id)->first();
		return $this->jsonResponse($data, 200, "Flag Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('flag')->ignore($id, 'flag_id')->where('company_id', $request['company_id'])],
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

		if (!isPermission('add', 'flag', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'flag_id' => $uuid,
			'name' => $request->name ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		$user = Flag::create($insertArr);


		$this->auditAction($request->all(), "Insert", "flag", "flag", $uuid, $request->name, $insertArr);

		return $this->jsonResponse(['flag_id' => $uuid], 200, "Add Flag Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'flag', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = Flag::where('flag_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->name  = $request->name ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;



		$data->update();
		$this->auditAction($request->all(), "Update", "flag", "flag", $id, $request->name, $data);

		return $this->jsonResponse(['flag_id' => $id], 200, "Update Flag Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'flag', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Flag::where('flag_id', $id)->first();

		$req = [
			'main' => [
				'check' => new Flag,
				'id' => $id,
			],
			'with' => [
				['model' => new Vessel],
			]
		];

		$res = $this->checkAndDelete($req);
		if ($res['error']) {
			return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
		}
		$this->auditAction($request->all(), "Delete", "flag", "flag", $id, $data->name, $data);
		$data->delete();

		return $this->jsonResponse(['flag_id' => $id], 200, "Delete Flag Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'flag', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->flag_ids) && !empty($request->flag_ids) && is_array($request->flag_ids)) {
				foreach ($request->flag_ids as $flag_id) {
					$user = Flag::where(['flag_id' => $flag_id])->first();
					$req = [
						'main' => [
							'check' => new Flag,
							'id' => $flag_id,
						],
						'with' => [
							['model' => new Vessel],
						]
					];

					$res = $this->checkAndDelete($req);
					if ($res['error']) {
						return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
					}
					$this->auditAction($request->all(), "Delete", "flag", "flag", $flag_id, $user->name, $user);
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Flag successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
