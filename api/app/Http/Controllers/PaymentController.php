<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Payment;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
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

		$data = new Payment;
		if (!empty($name)) $data = $data->where('name', 'like', '%' . $name . '%');
		$data = $data->where('company_id', '=', $request->company_id);
		$data = $data->where('company_branch_id', '=', $request->company_branch_id);

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
		$data = Payment::where('payment_id', $id)->first();
		return $this->jsonResponse($data, 200, "Payment Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('payment')->ignore($id, 'payment_id')->where('company_id', $request['company_id'])],
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

		if (!isPermission('add', 'payment', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'payment_id' => $uuid,
			'name' => $request->name ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$user = Payment::create($insertArr);

		return $this->jsonResponse(['payment_id' => $uuid], 200, "Add Payment Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'payment', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = Payment::where('payment_id', $id)->first();
		$data->company_id  = $request->company_id ?? "";
		$data->company_branch_id  = $request->company_branch_id ?? "";
		$data->name  = $request->name ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;



		$data->update();


		return $this->jsonResponse(['payment_id' => $id], 200, "Update Payment Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'payment', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Payment::where('payment_id', $id)->first();

		if (!$data) return $this->jsonResponse(['payment_id' => $id], 404, "Payment Not Found!");

		$data->delete();

		return $this->jsonResponse(['payment_id' => $id], 200, "Delete Payment Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'payment', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->payment_ids) && !empty($request->payment_ids) && is_array($request->payment_ids)) {
				foreach ($request->payment_ids as $payment_id) {
					$user = Payment::where(['payment_id' => $payment_id])->first();
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Payment successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
