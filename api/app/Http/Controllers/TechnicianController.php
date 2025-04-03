<?php
// Not in use
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Technician;
use Illuminate\Validation\Rule;

class TechnicianController extends Controller
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

		$data = new Technician;
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
		$data = Technician::where('technician_id', $id)->first();
		return $this->jsonResponse($data, 200, "Technician Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('technician')->ignore($id, 'technician_id')->where('company_id', $request['company_id'])->where('company_branch_id', $request['company_branch_id'])],
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

		if (!isPermission('add', 'technician', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'technician_id' => $uuid,
			'name' => $request->name ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$user = Technician::create($insertArr);

		return $this->jsonResponse(['technician_id' => $uuid], 200, "Add Technician Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'technician', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = Technician::where('technician_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->name  = $request->name ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;



		$data->update();


		return $this->jsonResponse(['technician_id' => $id], 200, "Update Technician Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'technician', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Technician::where('technician_id', $id)->first();

		if (!$data) return $this->jsonResponse(['technician_id' => $id], 404, "Technician Not Found!");

		$data->delete();

		return $this->jsonResponse(['technician_id' => $id], 200, "Delete Technician Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'technician', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->technician_ids) && !empty($request->technician_ids) && is_array($request->technician_ids)) {
				foreach ($request->technician_ids as $technician_id) {
					$user = Technician::where(['technician_id' => $technician_id])->first();
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Technician successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
