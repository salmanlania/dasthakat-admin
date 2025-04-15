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
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

use function PHPUnit\Framework\returnSelf;

class CompanyController extends Controller
{
	protected $db;

	public function index(Request $request)
	{

		$name = $request->input('name', '');
		$currency_id = $request->input('currency_id', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'company.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = Company::LeftJoin('currency as c', 'company.base_currency_id', 'c.currency_id');
		if (!empty($name)) $data = $data->where('company.name', 'like', '%' . $name . '%');
		if (!empty($currency_id)) $data = $data->where('company.base_currency_id', '=', $currency_id);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('company.name', 'like', '%' . $search . '%')
					->orWhere('c.name', 'like', '%' . $search . '%')
					->orWhere('company.created_at', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("company.*", 'company.company_id as company_id', "c.name as currency_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{
		$data = Company::LeftJoin('currency as c', 'company.base_currency_id', 'c.currency_id')
			->select("company.*", "c.name as currency_name")->where('company.company_id', $id)->first();
		$data['image_url']  = !empty($data['image']) ?  url('public/uploads/' . $data['image']) : '';
		return $this->jsonResponse($data, 200, "Company Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('company')->ignore($id, 'company_id')],
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

		if (!isPermission('add', 'company', $request->permission_list))
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
		$insertArr = [
			'company_id' => $uuid,
			'name' => $request->name ?? "",
			'base_currency_id' => $request->currency_id ?? "",
			'is_exempted' => $request->is_exempted ?? 0,
			'address' => $request->address ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];

		if (isset($imageData) && !empty($imageData))
			$insertArr['image'] =  $image;


		//Add User Data
		$user = Company::InsertGetId($insertArr);

		return $this->jsonResponse(['company_id' => $uuid], 200, "Add Company Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'company', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data      = $request->all();
		$imageData = $data['image'] ?? "";
		$image = "";
		if (isset($imageData) && !empty($imageData))
			$image = $this->base64ToImage($imageData);

		$data  = Company::where('company_id', $id)->first();

		$data->name  = $request->name ?? "";
		$data->base_currency_id  = $request->currency_id ?? "";
		$data->is_exempted = $request->is_exempted ?? 0;
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


		return $this->jsonResponse(['company_id' => $id], 200, "Update Company Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'company', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data = Company::where('company_id', $id)->first();

		$req = [
			'main' => [
				'check' => new Company,
				'id' => $id,
			],
			'with' => [
				['model' => new CompanyBranch],
				['model' => new User],
			],
		];

		$res = $this->checkAndDelete($req);
		if ($res['error']) {
			return $this->jsonResponse($res['msg'], $res['error_code'], "Delete Failed!");
		}

		deleteFile($data->image);
		$data->delete();
		return $this->jsonResponse(['company_id' => $id], 200, "Delete Company Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'company', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->company_ids) && !empty($request->company_ids) && is_array($request->company_ids)) {
				foreach ($request->company_ids as $company_id) {
					$data = Company::where(['company_id' => $company_id])->first();
					$req = [
						'main' => [
							'check' => new Company,
							'id' => $company_id,
						],
						'with' => [
							['model' => new CompanyBranch],
						],
					];

					$res = $this->checkAndDelete($req);
					if ($res['error']) {
						return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
					}
					deleteFile($data->image);
					$data->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Companies successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
