<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\CommissionAgent;

use Carbon\Carbon;
use Illuminate\Validation\Rule;

class CommissionAgentController extends Controller

{
	protected $db;

	public function index(Request $request)
	{
		$name = $request->input('name', '');
		$address = $request->input('address', '');
		$phone = $request->input('phone', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = new CommissionAgent;
		$data = $data->where('company_id', '=', $request->company_id);
		$data = $data->where('company_branch_id', '=', $request->company_branch_id);
		if (!empty($name)) $data = $data->where('name', 'like', '%' . $name . '%');
		if (!empty($address)) $data = $data->where('address', 'like', '%' . $address . '%');
		if (!empty($phone)) $data = $data->where('phone', 'like', '%' . $phone . '%');

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('name', 'like', '%' . $search . '%')
					->orWhere('address', 'like', '%' . $search . '%')
					->orWhere('phone', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("*");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{
		$data = CommissionAgent::where('commission_agent_id', $id)->first();
		return $this->jsonResponse($data, 200, "Agent Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('commission_agent')->ignore($id, 'commission_agent_id')->where('company_id', $request['company_id'])->where('company_branch_id', $request['company_branch_id'])],
		];

		$validator = Validator::make($request, $rules);
		if ($validator->fails()) {
			$firstError = $validator->errors()->first();
			return  $firstError;
		}
		return [];
	}



	public function store(Request $request)
	{

		if (!isPermission('add', 'commission_agent', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'commission_agent_id' => $uuid,
			'name' => $request->name ?? "",
			'address' => $request->address ?? "",
			'phone' => $request->phone ?? "",
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		];


		$user = CommissionAgent::create($insertArr);

		return $this->jsonResponse(['commission_agent_id' => $uuid], 200, "Add Commission Agent Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'commission_agent', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = CommissionAgent::where('commission_agent_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->name  = $request->name ?? "";
		$data->address  = $request->address ?? "";
		$data->phone  = $request->phone ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;



		$data->update();


		return $this->jsonResponse(['commission_agent_id' => $id], 200, "Update Commission Agent Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'commission_agent', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = CommissionAgent::where('commission_agent_id', $id)->first();

		if (!$data) return $this->jsonResponse(['commission_agent_id' => $id], 404, "Commission Agent Not Found!");
		// $validate = [
		// 	'main' => [
		// 		'check' => new CommissionAgent,
		// 		'id' => $id,
		// 	],
		// 	'with' => [
		// 		['model' => new Vessel],
		// 	]
		// ];

		// $response = $this->checkAndDelete($validate);
		// if ($response['error']) {
		// 	return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
		// }
		$data->delete();

		return $this->jsonResponse(['commission_agent_id' => $id], 200, "Delete Agent Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'commission_agent', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->commission_agent_ids) && !empty($request->commission_agent_ids) && is_array($request->commission_agent_ids)) {
				foreach ($request->commission_agent_ids as $commission_agent_id) {
					$user = CommissionAgent::where(['commission_agent_id' => $commission_agent_id])->first();

					// $validate = [
					// 	'main' => [
					// 		'check' => new Agent,
					// 		'id' => $commission_agent_id,
					// 	],
					// 	'with' => [
					// 		['model' => new ChargeOrder],
					// 	]
					// ];

					// $response = $this->checkAndDelete($validate);
					// if ($response['error']) {
					// 	return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
					// }


					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Commission Agent successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
