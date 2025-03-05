<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Currency;
use Illuminate\Validation\Rule;

class CurrencyController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
		$name = $request->input('name', '');
		$currency_code = $request->input('currency_code', '');
		$symbol_left = $request->input('symbol_left', '');
		$symbol_right = $request->input('symbol_right', '');
		$value = $request->input('value', '');
		$all = $request->input('all', '');
		$status = $request->input('status', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = new Currency;
		$data = $data->where('company_id', '=', $request->company_id);
		if (!empty($name)) $data = $data->where('name', 'like', '%' . $name . '%');
		if (!empty($currency_code)) $data = $data->where('currency_code', 'like', '%' . $currency_code . '%');
		if (!empty($symbol_left)) $data = $data->where('symbol_left', 'like', '%' . $symbol_left . '%');
		if (!empty($symbol_right)) $data = $data->where('symbol_right', 'like', '%' . $symbol_right . '%');
		if (!empty($value)) $data = $data->where('value', 'like', '%' . $value . '%');
		if ($all != 1) $data = $data->where('status', '=', 1);
		if ($status != "") $data = $data->where('status', '=', $status);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('name', 'like', '%' . $search . '%')
					->orWhere('currency_code', 'like', '%' . $search . '%')
					->orWhere('symbol_left', 'like', '%' . $search . '%')
					->orWhere('symbol_right', 'like', '%' . $search . '%')
					->orWhere('value', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("*");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = Currency::where('currency_id', $id)->first();
		return $this->jsonResponse($data, 200, "Currency Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('currency')->ignore($id, 'currency_id')->where('company_id', $request['company_id'])],
			'currency_code' => ['required', Rule::unique('currency')->ignore($id, 'currency_id')->where('company_id', $request['company_id'])],
			'value' => 'required',
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

		if (!isPermission('add', 'currency', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'currency_id' => $uuid,
			'name' => $request->name ?? "",
			'currency_code' => $request->currency_code ?? "",
			'symbol_left' => $request->symbol_left ?? "",
			'symbol_right' => $request->symbol_right ?? "",
			'value' => $request->value ?? "",
			'status' => $request->status ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		Currency::create($insertArr);

		return $this->jsonResponse(['currency_id' => $uuid], 200, "Add Currency Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'currency', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data  = Currency::where('currency_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->currency_code  = $request->currency_code ?? "";
		$data->name  = $request->name ?? "";
		$data->symbol_left  = $request->symbol_left ?? "";
		$data->symbol_right  = $request->symbol_right ?? "";
		$data->value  = $request->value ?? "";
		$data->status  = $request->status ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;

		$data->update();


		return $this->jsonResponse(['currency_id' => $id], 200, "Update Currency Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'currency', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Currency::where('currency_id', $id)->first();

		$req = [
			'main' => [
				'check' => new Currency,
				'id' => $id,
			],
			'with' => [
				['model' => new Company, "key" => "base_currency_id"],
			],
		];

		$res = $this->checkAndDelete($req);
		if ($res['error']) {
			return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
		}

		$data->delete();
		return $this->jsonResponse(['currency_id' => $id], 200, "Delete Currency Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'currency', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->currency_ids) && !empty($request->currency_ids) && is_array($request->currency_ids)) {
				foreach ($request->currency_ids as $currency_id) {
					$user = Currency::where(['currency_id' => $currency_id])->first();
					$req = [
						'main' => [
							'check' => new Currency,
							'id' => $currency_id,
						],
						'with' => [
							['model' => new Company, "key" => "base_currency_id"],
						],
					];

					$res = $this->checkAndDelete($req);
					if ($res['error']) {
						return $this->jsonResponse($res['msg'], $res['error_code'], "Deletion Failed!");
					}

					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Currency successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
