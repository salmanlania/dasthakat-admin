<?php

namespace App\Http\Controllers;

use Illuminate\Database\DatabaseManager;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Mail\GenerateMail;
use App\Models\Company;
use App\Models\CompanyBranch;
use App\Models\Product;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CompanyBranchController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
		$company = $request->input('company', '');
		$name = $request->input('name', '');
		$branch_code = $request->input('branch_code', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'company_branch.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = CompanyBranch::LeftJoin('company', 'company_branch.company_id', 'company.company_id');
		if($request->user->super_admin != 1){
			$data = $data->where('company_branch.company_id', '=', $request->company_id);
		}
		if (!empty($company)) $data = $data->where('company.company_id', '=', $company);
		if (!empty($name)) $data = $data->where('company_branch.name', 'like', '%' . $name . '%');
		if (!empty($branch_code)) $data = $data->where('branch_code', 'like', '%' . $branch_code . '%');

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('company_branch.name', 'like', '%' . $search . '%')
					->orWhere('company.name', 'like', '%' . $search . '%')
					->orWhere('company_branch.branch_code', 'like', '%' . $search . '%')
					->orWhere('company_branch.created_at', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select('company.name as company_name', 'company_branch.*');
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = CompanyBranch::LeftJoin('company as c', 'company_branch.company_id', 'c.company_id')->where('company_branch.company_branch_id', $id)
			->select("company_branch.*", "c.name as company_name")
			->first();
		$data['image_url']  = !empty($data['image']) ?  url('public/uploads/' . $data['image']) : '';
		return $this->jsonResponse($data, 200, "Company Branch Data");
	}

	public function validateRequest($request, $id = null)
	{

		$rules = [
			'company' => 'required',
			'name' => ['required'],
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

		if (!isPermission('add', 'company_branch', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data      = $request->all();
		$imageData = $data['image'] ?? "";
		$image = "";
		if (isset($imageData) && !empty($imageData))
			$image = $this->base64ToImage($imageData);
		$uuid = $this->get_uuid();

		$uuid = $this->get_uuid();
		$maxCode = CompanyBranch::where('company_id', $request->company)
			->max('branch_code');

		$insertArr = [
			'company_id' => $request->company ?? "",
			'company_branch_id' => $uuid,
			'name' => $request->name ?? "",
			'branch_code' => intval($maxCode) + 1,
			'phone_no' => $request->phone_no ?? "",
			'address' => $request->address ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];

		if (isset($imageData) && !empty($imageData))
			$insertArr['image'] =  $image;


		$user = CompanyBranch::InsertGetId($insertArr);


		return $this->jsonResponse(['company_branch_id' => $uuid], 200, "Add Company Branch Successfully!");
	}

	public function update(Request $request, $id)
	{


		if (!isPermission('edit', 'company_branch', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data      = $request->all();
		$imageData = $data['image'];
		$image = "";
		if (isset($imageData) && !empty($imageData))
			$image = $this->base64ToImage($imageData);


		$data  = CompanyBranch::where('company_branch_id', $id)->first();
		$data->company_id  = $request->company ?? "";
		$data->name  = $request->name ?? "";
		$data->branch_code  = $request->branch_code ?? "";
		$data->phone_no = $request->phone_no ?? "";
		$data->address = $request->address ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;

		if (deleteFile($request->delete_image)) {
			$data->image = null;
		}
		if (isset($imageData) && !empty($imageData)) {
			$data->image = $image;
		}

		$data->update();


		return $this->jsonResponse(['company_branch_id' => $id], 200, "Update Company Branch Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'company_branch', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = CompanyBranch::where('company_branch_id', $id)->first();

		$req = [
			'main' => [
				'check' => new CompanyBranch,
				'id' => $id,
			],
			'with' => [
				['model' => new Product],
			],
		];

		$res = $this->checkAndDelete($req);
		if ($res['error']) {
			return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
		}
		deleteFile($data->image);
		$data->delete();

		return $this->jsonResponse(['company_branch_id' => $id], 200, "Delete Company Branch Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'company_branch', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->company_branch_ids) && !empty($request->company_branch_ids) && is_array($request->company_branch_ids)) {
				foreach ($request->company_branch_ids as $company_branch_id) {
					$user = CompanyBranch::where(['company_branch_id' => $company_branch_id])->first();


					$req = [
						'main' => [
							'check' => new CompanyBranch,
							'id' => $company_branch_id,
						],
						'with' => [
							['model' => new Product],
						],
					];

					$res = $this->checkAndDelete($req);
					if ($res['error']) {
						return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
					}

					deleteFile($user->image);
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Company Branch successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
