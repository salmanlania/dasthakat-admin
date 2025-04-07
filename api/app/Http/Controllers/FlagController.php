<?php

namespace App\Http\Controllers;

use App\Models\Audit;
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

	public function show($id, $jsonResponse = true)
	{
		$data = Flag::with('company', 'company_branch', 'created_user', 'updated_user')->where('flag_id', $id)->first();
		if ($jsonResponse) {
			return $this->jsonResponse($data, 200, "Show Data");
		} else {
			return $data;
		}
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('flag')->ignore($id, 'flag_id')->where('company_id', $request['company_id'])->where('company_branch_id', $request['company_branch_id'])],
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
		Flag::create($insertArr);

		Audit::onInsert(
			[
				"request" => $request,
				"table" => "flag",
				"id" => $uuid,
				"document_name" => $request->name,
				"document_type" => "flag",
				"json_data" => json_encode($this->show($uuid, false))
			]
		);
		
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

		Audit::onEdit(
			[
				"request" => $request,
				"table" => "flag",
				"id" => $id,
				"document_name" => $request->name,
				"document_type" => "flag",
				"json_data" => json_encode($this->show($id, false))
			]
		);

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

		Audit::onDelete(
			[
				"request" => $request,
				"table" => "flag",
				"id" => $id,
				"document_name" => $request->name,
				"document_type" => "flag",
				"json_data" => json_encode($this->show($id, false))
			]
		);
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

					Audit::onDelete(
						[
							"request" => $request,
							"table" => "flag",
							"id" => $flag_id,
							"document_name" => $user->name,
							"document_type" => "flag",
							"json_data" => json_encode($this->show($flag_id, false))
						]
					);
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Flag successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
