<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Port;
use App\Models\Quotation;
use Illuminate\Validation\Rule;

class PortController extends Controller
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

		$data = new Port;
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
		$data = Port::where('port_id', $id)->first();
		return $this->jsonResponse($data, 200, "Port Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('port')->ignore($id, 'port_id')->where('company_id', $request['company_id'])],
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

		if (!isPermission('add', 'port', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'port_id' => $uuid,
			'name' => $request->name ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$user = Port::create($insertArr);

		return $this->jsonResponse(['port_id' => $uuid], 200, "Add Port Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'port', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = Port::where('port_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->name  = $request->name ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;



		$data->update();


		return $this->jsonResponse(['port_id' => $id], 200, "Update Port Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'port', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Port::where('port_id', $id)->first();

		$req = [
			'main' => [
				'check' => new Port,
				'id' => $id,
			],
			'with' => [
				['model' => new Quotation],
			]
		];

		$res = $this->checkAndDelete($req);
		if ($res['error']) {
			return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
		}
		$data->delete();

		return $this->jsonResponse(['port_id' => $id], 200, "Delete Port Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'port', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->port_ids) && !empty($request->port_ids) && is_array($request->port_ids)) {
				foreach ($request->port_ids as $port_id) {
					$user = Port::where(['port_id' => $port_id])->first();
					$req = [
						'main' => [
							'check' => new Port,
							'id' => $port_id,
						],
						'with' => [
							['model' => new Quotation],
						]
					];
			
					$res = $this->checkAndDelete($req);
					if ($res['error']) {
						return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
					}
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Port successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
