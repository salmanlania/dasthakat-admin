<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\CustomerVessel;
use App\Models\Event;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Vessel;
use App\Models\VesselCommissionAgent;
use Carbon\Carbon;
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
		$customer_id = $request->input('customer_id', '');
		$billing_address = $request->input('billing_address', '');
		$block_status = $request->input('block_status', '');

		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'vessel.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data =  Vessel::LeftJoin('flag as f', 'vessel.flag_id', 'f.flag_id')
			->LeftJoin('class as c1', 'vessel.class1_id', 'c1.class_id')
			->LeftJoin('customer as c', 'vessel.customer_id', 'c.customer_id')
			->LeftJoin('class as c2', 'vessel.class2_id', 'c2.class_id');
		$data = $data->where('vessel.company_id', '=', $request->company_id);
		$data = $data->where('vessel.company_branch_id', '=', $request->company_branch_id);



		if (!empty($name)) $data = $data->where('vessel.name', 'like', '%' . $name . '%');
		if (!empty($imo)) $data = $data->where('vessel.imo', 'like', '%' . $imo . '%');
		if (!empty($billing_address)) $data = $data->where('vessel.billing_address', 'like', '%' . $billing_address . '%');
		if (!empty($flag_id)) $data = $data->where('vessel.flag_id', '=',  $flag_id);
		if (!empty($block_status)) $data = $data->where('vessel.block_status', '=',  $block_status);
		if (!empty($class1_id)) $data = $data->where('vessel.class1_id', '=',  $class1_id);
		if (!empty($class2_id)) $data = $data->where('vessel.class2_id', '=',  $class2_id);
		if (!empty($customer_id)) $data = $data->where('vessel.customer_id', '=',  $customer_id);

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('vessel.name', 'like', '%' . $search . '%')
					->orWhere('vessel.imo', 'like', '%' . $search . '%')
					->orWhere('c.name', 'like', '%' . $search . '%')
					->orWhere('f.name', 'like', '%' . $search . '%')
					->orWhere('c1.name', 'like', '%' . $search . '%')
					->orWhere('vessel.block_status', 'like', '%' . $search . '%')
					->orWhere('c2.name', 'like', '%' . $search . '%')
					->orWhere('vessel.billing_address', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("vessel.*", "c.name as customer_name", "f.name as flag_name", "c1.name as class1_name", "c2.name as class2_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function show($id, $jsonResponse = true)
	{

		$data =  Vessel::with("vessel_commission_agent","vessel_commission_agent.commission_agent","company", "company_branch", "created_user", "updated_user")->LeftJoin('flag as f', 'vessel.flag_id', 'f.flag_id')
			->LeftJoin('customer as c', 'c.customer_id', 'vessel.customer_id')
			->LeftJoin('class as c1', 'vessel.class1_id', 'c1.class_id')
			->LeftJoin('class as c2', 'vessel.class2_id', 'c2.class_id')
			->select("vessel.*", "c.name as customer_name", "f.name as flag_name", "c1.name as class1_name", "c2.name as class2_name")
			->where('vessel_id', $id)->first();
		if ($jsonResponse) {
			return $this->jsonResponse($data, 200, "Show Data");
		} else {
			return $data;
		}
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'flag_id' => 'required',
			'class1_id' => 'required',
			'imo' => 'required',
			'name' => ['required', Rule::unique('vessel')->ignore($id, 'vessel_id')->where('customer_id', $request['customer_id'])->where('company_id', $request['company_id'])->where('company_branch_id', $request['company_branch_id'])],
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
			'block_status' => $request->block_status ?? "",
			'customer_id' => $request->customer_id ?? "",
			'class1_id' => $request->class1_id ?? "",
			'class2_id' => $request->class2_id ?? "",
			'billing_address' => $request->billing_address ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$vessel = Vessel::create($insertArr);

		$insert = [
			'customer_vessel_id' => $this->get_uuid(),
			'customer_id' => $request->customer_id,
			'vessel_id' => $uuid,
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		CustomerVessel::insert($insert);

		Audit::onInsert(
			[
				"request" => $request,
				"table" => "vessel",
				"id" => $uuid,
				"document_name" => $insertArr['name'],
				"document_type" => "vessel",
				"json_data" => json_encode($this->show($uuid, false))
			]
		);



		// if(!empty($request->vessel_commission_agent)){
		// 	foreach($request->vessel_commission_agent as $row){

		// 		$insert = [
		// 			'vessel_commission_agent_id' => $this->get_uuid(),
		// 			'vessel_id' => $uuid,
		// 			'type' => $row['type'] ?? "",
		// 			'commission_agent_id' => $row['commission_agent_id'] ?? "",
		// 			'commission_percentage' => $row['commission_percentage'] ?? 0,
		// 			'status' => $row['status'],
		// 			'created_at' => Carbon::now(),
		// 			'created_by' => $request->login_user_id,
		// 		];
		// 		VesselCommissionAgent::insert($insert);

		// 	}
		// }
				

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

		CustomerVessel::where(['vessel_id' => $id, 'customer_id' => $data->customer_id])->delete();


		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->imo  = $request->imo ?? "";
		$data->name  = $request->name ?? "";
		$data->flag_id  = $request->flag_id ?? "";
		$data->block_status  = $request->block_status ?? "";
		$data->customer_id  = $request->customer_id ?? "";
		$data->class1_id  = $request->class1_id ?? "";
		$data->class2_id  = $request->class2_id ?? "";
		$data->billing_address  = $request->billing_address ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;

		$data->update();

		$insert = [
			'customer_vessel_id' => $this->get_uuid(),
			'customer_id' => $request->customer_id,
			'vessel_id' => $id,
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		CustomerVessel::insert($insert);

		Audit::onEdit(
			[
				"request" => $request,
				"table" => "vessel",
				"id" => $id,
				"document_name" => $data->name,
				"document_type" => "vessel",
				"json_data" => json_encode($this->show($id, false))
			]
		);


		// if(!empty($request->vessel_commission_agent)){
		// 	foreach($request->vessel_commission_agent as $row){
		// 		if($row['row_status'] == "D"){

		// 		}
		// 		if($row['row_status'] == "I"){
		// 			$insert = [
		// 				'vessel_commission_agent_id' => $this->get_uuid(),
		// 				'vessel_id' => $id,
		// 				'type' => $row['type'] ?? "",
		// 				'commission_agent_id' => $row['commission_agent_id'] ?? "",
		// 				'commission_percentage' => $row['commission_percentage'] ?? 0,
		// 				'status' => $row['status'],
		// 				'created_at' => Carbon::now(),
		// 				'created_by' => $request->login_user_id,
		// 			];
		// 			VesselCommissionAgent::insert($insert);
		// 		}
		// 		if($row['row_status'] == "U"){
		// 			$update = [
		// 				'type' => $row['type'] ?? "",
		// 				'commission_percentage' => $row['commission_percentage'] ?? 0,
		// 				'status' => $row['status'],
		// 				'updated_at' => Carbon::now(),
		// 				'updated_by' => $request->login_user_id,
		// 			];
		// 			VesselCommissionAgent::where('vessel_commission_agent_id',$row['vessel_commission_agent_id'])->update($update);
		// 		}
		// 	}
		// }
				

		return $this->jsonResponse(['vessel_id' => $id], 200, "Update Vessel Successfully!");
	}
	public function updateCommissionAgent(Request $request, $id)
	{
		if (!isPermission('edit', 'vessel_commission_agent', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		// Validation Rules
		// $isError = $this->validateRequest($request->all(), $id);
		// if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		if(!empty($request->vessel_commission_agent)){
			foreach($request->vessel_commission_agent as $row){
				if($row['row_status'] == "D"){
					VesselCommissionAgent::where('vessel_commission_agent_id',$row['vessel_commission_agent_id'])->delete();
				}
				if($row['row_status'] == "I"){
					$insert = [
						'sort_order' => $row['sort_order'] ?? 0,
						'vessel_commission_agent_id' => $this->get_uuid(),
						'vessel_id' => $id,
						'type' => $row['type'] ?? "",
						'commission_agent_id' => $row['commission_agent_id'] ?? "",
						'commission_percentage' => $row['commission_percentage'] ?? 0,
						'status' => $row['status'],
						'created_at' => Carbon::now(),
						'created_by' => $request->login_user_id,
					];
					VesselCommissionAgent::insert($insert);
				}
				if($row['row_status'] == "U"){
					$update = [
						'sort_order' => $row['sort_order'] ?? 0,
						'type' => $row['type'] ?? "",
						'commission_percentage' => $row['commission_percentage'] ?? 0,
						'commission_agent_id' => $row['commission_agent_id'] ?? "",
						'status' => $row['status'],
						'updated_at' => Carbon::now(),
						'updated_by' => $request->login_user_id,
					];
					VesselCommissionAgent::where('vessel_commission_agent_id',$row['vessel_commission_agent_id'])->update($update);
				}
			}
		}
				

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


		Audit::onDelete(
			[
				"request" => $request,
				"table" => "vessel",
				"id" => $id,
				"document_name" => $data->name,
				"document_type" => "vessel",
				"json_data" => json_encode($this->show($id, false))
			]
		);

		CustomerVessel::where(['vessel_id' => $id, 'customer_id' => $data->customer_id])->delete();

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
					$data = Vessel::where(['vessel_id' => $vessel_id])->first();
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

					Audit::onDelete(
						[
							"request" => $request,
							"table" => "vessel",
							"id" => $vessel_id,
							"document_name" => $data->name,
							"document_type" => "vessel",
							"json_data" => json_encode($this->show($vessel_id, false))
						]
					);
					CustomerVessel::where(['vessel_id' => $vessel_id, 'customer_id' => $data->customer_id])->delete();

					$data->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Vessel successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
