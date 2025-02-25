<?php

namespace App\Http\Controllers;

use Illuminate\Database\DatabaseManager;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Mail\GenerateMail;
use App\Models\Customer;
use App\Models\Supplier;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class SupplierController extends Controller
{
	protected $db;

	public function index(Request $request)
	{

		$supplier_code = $request->input('supplier_code', '');
		$name = $request->input('name', '');
		$location =  $request->input('location', '');
		$contact1 =  $request->input('contact1', '');
		$contact2 =  $request->input('contact2', '');
		$payment_id =  $request->input('payment_id', '');
		$email =  $request->input('email', '');
		$status =  $request->input('status', '');
		$all =  $request->input('all', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = Supplier::LeftJoin('payment as p', 'supplier.payment_id', '=', 'p.payment_id');
		$data = $data->where('company_id', '=', $request->company_id);
		// $data = $data->where('company_branch_id', '=', $request->company_branch_id);

		if (!empty($supplier_code)) $data = $data->where('supplier_code', 'like', '%' . $supplier_code . '%');
		if (!empty($payment_id)) $data = $data->where('supplier.payment_id', '=', $payment_id);
		if (!empty($name)) $data = $data->where('supplier.name', 'like', '%' . $name . '%');
		if (!empty($location)) $data = $data->where('supplier.location', 'like', '%' . $location . '%');
		if (!empty($contact1)) $data = $data->where('supplier.contact1', 'like', '%' . $contact1 . '%');
		if (!empty($contact2)) $data = $data->where('supplier.contact2', 'like', '%' . $contact1 . '%');
		if (!empty($email)) $data = $data->where('supplier.email', 'like', '%' . $email . '%');
		if ($all != 1) $data = $data->where('supplier.status', '=', 1);
		if ($status != "") $data = $data->where('supplier.status', '=', $status);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('supplier.supplier_code', 'like', '%' . $search . '%')
					->orWhere('p.name', 'like', '%' . $search . '%')
					->orWhere('supplier.name', 'like', '%' . $search . '%')
					->orWhere('supplier.location', 'like', '%' . $search . '%')
					->orWhere('supplier.contact1', 'like', '%' . $search . '%')
					->orWhere('supplier.contact2', 'like', '%' . $search . '%')
					->orWhere('supplier.email', 'like', '%' . $search . '%')
					->orWhere('supplier.created_at', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("supplier.*", "p.name as payment_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = Supplier::with('payment')->where('supplier_id', $id)->first();
		return $this->jsonResponse($data, 200, "Supplier Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('supplier')->ignore($id, 'supplier_id')->where('company_id', $request['company_id'])],

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


		if (!isPermission('add', 'supplier', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$uuid = $this->get_uuid();
		$maxCode = Supplier::where('company_id', $request->company_id)
			->where('company_branch_id', $request->company_branch_id)
			->max('supplier_code');
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'supplier_id' => $uuid,
			'name' => $request->name,
			'supplier_code' => intval($maxCode) + 1,
			'payment_id' => $request->payment_id ?? "",
			'location' => $request->location ?? "",
			'contact_person' => $request->contact_person ?? "",
			'contact1' => $request->contact1 ?? "",
			'contact2' => $request->contact2 ?? "",
			'email' => $request->email ?? "",
			'address' => $request->address ?? "",
			'status' => $request->status ?? 0,
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$data = Supplier::create($insertArr);

		return $this->jsonResponse(['supplier_id' => $uuid], 200, "Add Supplier Successfully!");
	}

	public function update(Request $request, $id)
	{

		if (!isPermission('edit', 'supplier', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data  = Supplier::where('supplier_id', $id)->first();

		$data->company_id = $request->company_id ?? "";
		$data->company_branch_id = $request->company_branch_id ?? "";
		$data->name = $request->name ?? "";
		$data->payment_id = $request->payment_id ?? "";
		$data->location = $request->location ?? "";
		$data->contact_person = $request->contact_person ?? "";
		$data->contact1 = $request->contact1 ?? "";
		$data->contact2 = $request->contact2 ?? "";
		$data->email = $request->email ?? "";
		$data->address = $request->address ?? "";
		$data->status = $request->status ?? 0;
		$data->updated_at =  date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;

		$data->update();


		return $this->jsonResponse(['supplier_id' => $id], 200, "Update Supplier Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'supplier', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$supplier  = Supplier::where('supplier_id', $id)->first();

		if (!$supplier) return $this->jsonResponse(['supplier_id' => $id], 404, "Supplier Not Found!");

		$supplier->delete();

		return $this->jsonResponse(['supplier_id' => $id], 200, "Delete Supplier Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'supplier', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->supplier_ids) && !empty($request->supplier_ids) && is_array($request->supplier_ids)) {
				foreach ($request->supplier_ids as $supplier_id) {
					$supplier = Supplier::where(['supplier_id' => $supplier_id])->first();
					$supplier->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Supplier successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
