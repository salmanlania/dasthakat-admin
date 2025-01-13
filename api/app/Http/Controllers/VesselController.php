<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Vessel;
use Illuminate\Validation\Rule;

class VesselController extends Controller
{
	protected $db;

	public function index(Request $request)
	{

		$imo = $request->input('imo', '');
		$name = $request->input('name', '');
		$flag_id = $request->input('flag_id', '');
		$class1_id = $request->input('class1_id', '');
		$class2_id = $request->input('class2_id', '');
		$billing_address = $request->input('billing_address', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'vessel.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data =  Vessel::LeftJoin('flag as f', 'vessel.flag_id', 'f.flag_id')
			->LeftJoin('class as c1', 'vessel.class1_id', 'c1.class_id')
			->LeftJoin('class as c2', 'vessel.class2_id', 'c2.class_id');



		if (!empty($name)) $data = $data->where('vessel.name', 'like', '%' . $name . '%');
		if (!empty($imo)) $data = $data->where('vessel.imo', 'like', '%' . $imo . '%');
		if (!empty($billing_address)) $data = $data->where('vessel.billing_address', 'like', '%' . $billing_address . '%');
		if (!empty($flag_id)) $data = $data->where('vessel.flag_id', '=',  $flag_id);
		if (!empty($class1_id)) $data = $data->where('vessel.class1_id', '=',  $class1_id);
		if (!empty($class2_id)) $data = $data->where('vessel.class2_id', '=',  $class2_id);
		$data = $data->where('vessel.company_id', '=', $request->company_id);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('vessel.name', 'like', '%' . $search . '%')
					->orWhere('vessel.imo', 'like', '%' . $search . '%')
					->orWhere('f.name', 'like', '%' . $search . '%')
					->orWhere('c1.name', 'like', '%' . $search . '%')
					->orWhere('c2.name', 'like', '%' . $search . '%')
					->orWhere('vessel.billing_address', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("vessel.*", "f.name as flag_name", "c1.name as class1_name", "c2.name as class2_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data =  Vessel::LeftJoin('flag as f', 'vessel.flag_id', 'f.flag_id')
			->LeftJoin('class as c1', 'vessel.class1_id', 'c1.class_id')
			->LeftJoin('class as c2', 'vessel.class2_id', 'c2.class_id')
			->select("vessel.*", "f.name as flag_name", "c1.name as class1_name", "c2.name as class2_name")
			->where('vessel_id', $id)->first();
		return $this->jsonResponse($data, 200, "Flag Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'flag_id' => 'required',
			'class1_id' => 'required',
			'imo' => 'required',
			'name' => ['required', Rule::unique('vessel')->ignore($id, 'vessel_id')->where('company_id', $request['company_id'])],
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

		if (!isPermission('add', 'vessel', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'imo' => $request->imo ?? "",
			'name' => $request->name ?? "",
			'vessel_id' => $uuid,
			'flag_id' => $request->flag_id ?? "",
			'class1_id' => $request->class1_id ?? "",
			'class2_id' => $request->class2_id ?? "",
			'billing_address' => $request->billing_address ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$vessel = Vessel::create($insertArr);

		return $this->jsonResponse(['vessel_id' => $uuid], 200, "Add Vessel Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'vessel', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data  = Vessel::where('vessel_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->imo  = $request->imo ?? "";
		$data->name  = $request->name ?? "";
		$data->flag_id  = $request->flag_id ?? "";
		$data->class1_id  = $request->class1_id ?? "";
		$data->class2_id  = $request->class2_id ?? "";
		$data->billing_address  = $request->billing_address ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;

		$data->update();


		return $this->jsonResponse(['vessel_id' => $id], 200, "Update Vessel Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'vessel', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Vessel::where('vessel_id', $id)->first();

		$req = [
			'main' => [
				'check' => new Vessel,
				'id' => $id,
			],
			'with' => [
				['model' => new Event],
			]
		];

		$res = $this->checkAndDelete($req);
		if ($res['error']) {
			return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
		}
		$data->delete();

		return $this->jsonResponse(['vessel_id' => $id], 200, "Delete Vessel Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'vessel', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->vessel_ids) && !empty($request->vessel_ids) && is_array($request->vessel_ids)) {
				foreach ($request->vessel_ids as $vessel_id) {
					$user = Vessel::where(['vessel_id' => $vessel_id])->first();
					$req = [
						'main' => [
							'check' => new Vessel,
							'id' => $vessel_id,
						],
						'with' => [
							['model' => new Event],
						]
					];
			
					$res = $this->checkAndDelete($req);
					if ($res['error']) {
						return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
					}
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Vessel successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
