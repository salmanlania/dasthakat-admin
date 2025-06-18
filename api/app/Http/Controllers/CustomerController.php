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
use App\Models\CustomerCommissionAgent;
use App\Models\CustomerVessel;
use App\Models\Quotation;
use App\Models\Vessel;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
		$customer_code = $request->input('customer_code', '');
		$name = $request->input('name', '');
		$salesman_id =  $request->input('salesman_id', '');
		$country =  $request->input('country', '');
		$status =  $request->input('status', '');
		$address =  $request->input('address', '');
		$payment_id =  $request->input('payment_id', '');
		$vessel_id =  $request->input('vessel_id', []);
		$phone_no =  $request->input('phone_no', '');
		$block_status =  $request->input('block_status', []);
		$email_sales =  $request->input('email_sales', '');
		$email_accounting =  $request->input('email_accounting', '');
		$billing_address =  $request->input('billing_address', '');
		$rebate_percent =  $request->input('rebate_percent', '');
		$all =  $request->input('all', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'customer.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data =  Customer::with("pivot_vessel")
			->LeftJoin('salesman as s', 's.salesman_id', '=', 'customer.salesman_id')
			->LeftJoin('payment as p', 'p.payment_id', '=', 'customer.payment_id');
		$data = $data->where('customer.company_id', '=', $request->company_id);
		$data = $data->where('customer.company_branch_id', '=', $request->company_branch_id);
		if (!empty($customer_code)) $data = $data->where('customer.customer_code', 'like', '%' . $customer_code . '%');
		if (!empty($name)) $data = $data->where('customer.name', 'like', '%' . $name . '%');
		if (!empty($salesman_id)) $data = $data->where('customer.salesman_id', "=", $salesman_id);
		if (!empty($payment_id)) $data = $data->where('customer.payment_id', "=", $payment_id);
		if (!empty($block_status)) $data = $data->where('customer.block_status', "=", $block_status);
		if (!empty($country)) $data = $data->where('customer.country', 'like', '%' . $country . '%');
		if (!empty($address)) $data = $data->where('customer.address', 'like', '%' . $address . '%');
		if (!empty($phone_no)) $data = $data->where('customer.phone_no', 'like', '%' . $phone_no . '%');
		if (!empty($email_sales)) $data = $data->where('customer.email_sales', 'like', '%' . $email_sales . '%');
		if (!empty($email_accounting)) $data = $data->where('customer.email_accounting', 'like', '%' . $email_accounting . '%');
		if (!empty($billing_address)) $data = $data->where('customer.billing_address', 'like', '%' . $billing_address . '%');
		if (!empty($rebate_percent)) $data = $data->where('customer.rebate_percent', 'like', '%' . $rebate_percent . '%');
		if ($all != 1) $data = $data->where('customer.status', '=', 1);
		if (!empty($status) || $status == '0') $data = $data->where('customer.status', '=', $status);
		if (!empty($vessel_id) && is_array($vessel_id)) {
			$data = $data->whereHas('pivot_vessel', function ($query) use ($vessel_id) {
				$query->whereIn('vessel.vessel_id', $vessel_id);
			});
		}
		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('customer.customer_code', 'like', '%' . $search . '%')
					->orWhere('customer.name', 'like', '%' . $search . '%')
					->orWhere('s.name', 'like', '%' . $search . '%')
					->orWhere('customer.country', 'like', '%' . $search . '%')
					->orWhere('customer.address', 'like', '%' . $search . '%')
					->orWhere('customer.billing_address', 'like', '%' . $search . '%')
					->orWhere('customer.block_status', 'like', '%' . $search . '%')
					->orWhere('customer.phone_no', 'like', '%' . $search . '%')
					->orWhere('customer.email_sales', 'like', '%' . $search . '%')
					->orWhere('customer.email_accounting', 'like', '%' . $search . '%')
					->orWhere('p.name', 'like', '%' . $search . '%')
					->orWhere('customer.rebate_percent', 'like', '%' . $search . '%')
				;
			});
		}

		$data = $data->select("customer.*", "p.name as payment_name", "s.name as salesman_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		foreach ($data as $key => &$value) {

			$vessels = CustomerVessel::where('customer_id', $value->customer_id)->pluck('vessel_id')->toArray();
			$vessel = Vessel::whereIn('vessel_id', $vessels)->get();
			$value->vessel = $vessel;
		}
		// $data->load('vessel');
		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = Customer::with("payment")
			->LeftJoin('salesman as s', 's.salesman_id', '=', 'customer.salesman_id')
			->where('customer_id', $id)
			->select("customer.*", "s.name as salesman_name")->first();
		$vessels = CustomerVessel::where('customer_id', $id)->pluck('vessel_id')->toArray();
		$vessel = Vessel::whereIn('vessel_id', $vessels)->get();
		$data->vessel = $vessel;

		return $this->jsonResponse($data, 200, "Customer Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'name' => ['required', Rule::unique('customer')->ignore($id, 'customer_id')->where('company_id', $request['company_id'])->where('company_branch_id', $request['company_branch_id'])],

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


		if (!isPermission('add', 'customer', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$uuid = $this->get_uuid();
		$maxCode = Customer::where('company_id', $request->company_id)
			->where('company_branch_id', $request->company_branch_id)
			->max('customer_code');
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'customer_id' => $uuid,
			'name' => $request->name,
			'customer_code' => intval($maxCode) + 1 ?? "",
			'salesman_id' => $request->salesman_id ?? "",
			'country' => $request->country ?? "",
			'block_status' => $request->block_status ?? "",
			'address' => $request->address ?? "",
			'billing_address' => $request->billing_address ?? "",
			'phone_no' => $request->phone_no ?? "",
			'email_sales' => $request->email_sales ?? "",
			'email_accounting' => $request->email_accounting ?? "",
			'payment_id' => $request->payment_id ?? "",
			'rebate_percent' => $request->rebate_percent ?? "",
			'status' => $request->status ?? 0,
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		$data = Customer::create($insertArr);

		if (isset($request->vessel_id)) {
			foreach ($request->vessel_id as $key => $value) {
				$insert = [
					'customer_vessel_id' => $this->get_uuid(),
					'customer_id' => $uuid,
					'vessel_id' => $value,
					'created_at' => date('Y-m-d H:i:s'),
					'created_by' => $request->login_user_id,
				];
				CustomerVessel::insert($insert);
			}
		}
	
		if(!empty($request->customer_commission_agent)){
			foreach($request->customer_commission_agent as $row){

				$insert = [
					'customer_commission_agent_id' => $this->get_uuid(),
					'customer_id' => $uuid,
					'type' => $row->type ?? "",
					'commission_agent_id' => $row->commission_agent_id ?? "",
					'commission_percentage' => $row->commission_percentage ?? 0,
					'status' => $row->status,
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id,
				];
				CustomerCommissionAgent::insert($insert);

			}
		}
		
	
		return $this->jsonResponse(['customer_id' => $uuid], 200, "Add Customer Successfully!");
	}

	public function update(Request $request, $id)
	{

		if (!isPermission('edit', 'customer', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data  = Customer::where('customer_id', $id)->first();

		$data->company_id = $request->company_id ?? "";
		$data->company_branch_id = $request->company_branch_id ?? "";
		$data->name = $request->name ?? "";
		$data->salesman_id = $request->salesman_id ?? "";
		$data->country = $request->country ?? "";
		$data->address = $request->address ?? "";
		$data->billing_address = $request->billing_address ?? "";
		$data->phone_no = $request->phone_no ?? "";
		$data->block_status = $request->block_status ?? "";
		$data->email_sales = $request->email_sales ?? "";
		$data->email_accounting = $request->email_accounting ?? "";
		$data->payment_id = $request->payment_id ?? "";
		$data->rebate_percent = $request->rebate_percent ?? "";
		$data->status = $request->status ?? 0;
		$data->updated_at =  date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;
		$data->update();
		CustomerVessel::where('customer_id', $id)->delete();

		if (isset($request->vessel_id)) {
			foreach ($request->vessel_id as $key => $value) {
				$insert = [
					'customer_vessel_id' => $this->get_uuid(),
					'customer_id' => $id,
					'vessel_id' => $value,
					'created_at' => date('Y-m-d H:i:s'),
					'created_by' => $request->login_user_id,
				];
				CustomerVessel::insert($insert);
			}
		}

		if(!empty($request->customer_commission_agent)){
			foreach($request->customer_commission_agent as $row){
				if($row['row_status'] == "D"){

				}
				if($row['row_status'] == "I"){
					$insert = [
						'customer_commission_agent_id' => $this->get_uuid(),
						'customer_id' => $id,
						'type' => $row->type ?? "",
						'commission_agent_id' => $row->commission_agent_id ?? "",
						'commission_percentage' => $row->commission_percentage ?? 0,
						'status' => $row->status,
						'created_at' => Carbon::now(),
						'created_by' => $request->login_user_id,
					];
					CustomerCommissionAgent::insert($insert);
				}
				if($row['row_status'] == "U"){
					$update = [
						'type' => $row->type ?? "",
						'commission_percentage' => $row->commission_percentage ?? 0,
						'status' => $row->status,
						'updated_at' => Carbon::now(),
						'updated_by' => $request->login_user_id,
					];
					CustomerCommissionAgent::where('customer_commission_agent_id',$row['customer_commission_agent_id'])->update($update);
				}
			}
		}


		return $this->jsonResponse(['customer_id' => $id], 200, "Update Customer Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'customer', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$customer  = Customer::where('customer_id', $id)->first();

		if (!$customer) return $this->jsonResponse(['customer_id' => $id], 404, "Customer Not Found!");
		$validate = [
			'main' => [
				'check' => new Customer,
				'id' => $id,
			],
			'with' => [
				['model' => new Quotation],
			]
		];

		$response = $this->checkAndDelete($validate);
		if ($response['error']) {
			return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
		}
		$customer->delete();
		CustomerVessel::where('customer_id', $id)->delete();

		return $this->jsonResponse(['customer_id' => $id], 200, "Delete Customer Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'customer', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->customer_ids) && !empty($request->customer_ids) && is_array($request->customer_ids)) {
				foreach ($request->customer_ids as $customer_id) {
					$customer = Customer::where(['customer_id' => $customer_id])->first();
					$validate = [
						'main' => [
							'check' => new Customer,
							'id' => $customer_id,
						],
						'with' => [
							['model' => new Quotation],
						]
					];

					$response = $this->checkAndDelete($validate);
					if ($response['error']) {
						return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
					}

					$customer->delete();
					CustomerVessel::where('customer_id', $customer_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Customer successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
