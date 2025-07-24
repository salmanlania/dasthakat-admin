<?php

namespace App\Http\Controllers\VendorPlatform;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Agent;
use App\Models\ChargeOrder;
use App\Models\VendorPlatform\VpQuotationRfq;
use Illuminate\Validation\Rule;

class VpQuotationRfqController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
	    $document_identity = $request->input('document_identity', '');
        $quotation_no = $request->input('quotation_no', '');
        $vessel_id = $request->input('vessel_id', '');
        $event_id = $request->input('event_id', '');
        $required_date = $request->input('required_date', '');
        $status = $request->input('status', '');
        $total_items = $request->input('total_items', '');
        $items_quoted = $request->input('items_quoted', '');
        $date_sent = $request->input('date_sent', '');
        $date_returned = $request->input('date_returned', '');
        $vendor_id = $request->input('vendor_id', '');
        $person_incharge_id = $request->input('person_incharge_id', '');
        
		$search = $request->input('search', '');
        $date_from = $request->input('date_from', '');
        $date_to = $request->input('date_to', '');

		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = VpQuotationRfq::leftJoin('quotation as q', 'q.quotation_id', '=', 'vp_quotation_rfq.quotation_id')
            ->leftJoin('vessel as v', 'v.vessel_id', '=', 'q.vessel_id')
            ->leftJoin('event as e', 'e.event_id', '=', 'q.event_id')
            ->leftJoin('supplier as s', 's.supplier_id', '=', 'vp_quotation_rfq.vendor_id')
            ->leftJoin('user as u', 'u.user_id', '=', 'q.person_incharge_id');

		$data = $data->where('vp_quotation_rfq.company_id', '=', $request->company_id);
		$data = $data->where('vp_quotation_rfq.company_branch_id', '=', $request->company_branch_id);
        if (!empty($document_identity)) $data = $data->where('vp_quotation_rfq.document_identity', 'like', '%' . $document_identity . '%');
        if (!empty($quotation_no)) $data = $data->where('q.document_identity', 'like', '%' . $quotation_no . '%');
        if (!empty($vessel_id)) $data = $data->where('q.vessel_id', $vessel_id);
        if (!empty($event_id)) $data = $data->where('q.event_id', $event_id);
        if (!empty($required_date)) $data = $data->where('vp_quotation_rfq.date_required', $required_date);
        if (!empty($status)) $data = $data->where('vp_quotation_rfq.status', $status);
        if (!empty($total_items)) $data = $data->where('vp_quotation_rfq.total_items', $total_items);
        if (!empty($items_quoted)) $data = $data->where('vp_quotation_rfq.items_quoted', $items_quoted);
        if (!empty($date_sent)) $data = $data->where('vp_quotation_rfq.date_sent', $date_sent);
        if (!empty($date_returned)) $data = $data->where('vp_quotation_rfq.date_returned', $date_returned);
        if (!empty($vendor_id)) $data = $data->where('vp_quotation_rfq.vendor_id', $vendor_id);
        if (!empty($person_incharge_id)) $data = $data->where('q.person_incharge_id', $person_incharge_id);
   
        if (!empty($search)) {
            $search = strtolower($search);
            $data = $data->where(function ($query) use ($search) {
                $query
                    ->where('vp_quotation_rfq.document_identity', 'like', '%' . $search . '%')
                    ->orWhere('q.document_identity', 'like', '%' . $search . '%')
                    ->orWhere('v.name', 'like', '%' . $search . '%')
                    ->orWhere('e.event_code', 'like', '%' . $search . '%')
                    ->orWhere('s.name', 'like', '%' . $search . '%')
                    ->orWhere('u.user_name', 'like', '%' . $search . '%')
                    ->orWhere('vp_quotation_rfq.status', 'like', '%' . $search . '%');
            });
        }
        if (!empty($date_from) && !empty($date_to)) {
            $data = $data->whereBetween('vp_quotation_rfq.date_sent', [$date_from, $date_to]);
        } elseif (!empty($date_from)) {
            $data = $data->where('vp_quotation_rfq.date_sent', '>=', $date_from);
        } elseif (!empty($date_to)) {
            $data = $data->where('vp_quotation_rfq.date_sent', '<=', $date_to);
        }
		
        $data = $data->select(
            'vp_quotation_rfq.*',
            'q.document_identity as quotation_no',
            'v.name as vessel_name',
            'e.event_code as event_code',
            's.name as vendor_name',
            'u.user_name as person_incharge_name'
        );
		
        $data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
        return response()->json($data);
	}

	public function show($id, Request $request)
	{
		$data = Agent::where('agent_id', $id)->first();
		return $this->jsonResponse($data, 200, "Agent Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'agent_code' => ['required', Rule::unique('agent')->ignore($id, 'agent_id')->where('company_id', $request['company_id'])->where('company_branch_id', $request['company_branch_id'])],
			'name' => ['required', Rule::unique('agent')->ignore($id, 'agent_id')->where('company_id', $request['company_id'])->where('company_branch_id', $request['company_branch_id'])],
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

		if (!isPermission('add', 'agent', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'agent_id' => $uuid,
			'agent_code' => $request->agent_code ?? "",
			'name' => $request->name ?? "",
			'address' => $request->address ?? "",
			'city' => $request->city ?? "",
			'state' => $request->state ?? "",
			'zip_code' => $request->zip_code ?? "",
			'phone' => $request->phone ?? "",
			'office_no' => $request->office_no ?? "",
			'fax' => $request->fax ?? "",
			'email' => $request->email ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$user = Agent::create($insertArr);

		return $this->jsonResponse(['agent_id' => $uuid], 200, "Add Agent Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'agent', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = Agent::where('agent_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->name  = $request->name ?? "";
		$data->agent_code  = $request->agent_code ?? "";
		$data->address  = $request->address ?? "";
		$data->city  = $request->city ?? "";
		$data->state  = $request->state ?? "";
		$data->zip_code  = $request->zip_code ?? "";
		$data->phone  = $request->phone ?? "";
		$data->office_no  = $request->office_no ?? "";
		$data->fax  = $request->fax ?? "";
		$data->email  = $request->email ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;



		$data->update();


		return $this->jsonResponse(['agent_id' => $id], 200, "Update Agent Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'agent', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Agent::where('agent_id', $id)->first();

		if (!$data) return $this->jsonResponse(['agent_id' => $id], 404, "Agent Not Found!");
		$validate = [
			'main' => [
				'check' => new Agent,
				'id' => $id,
			],
			'with' => [
				['model' => new ChargeOrder],
			]
		];

		$response = $this->checkAndDelete($validate);
		if ($response['error']) {
			return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
		}
		$data->delete();

		return $this->jsonResponse(['agent_id' => $id], 200, "Delete Agent Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'agent', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->agent_ids) && !empty($request->agent_ids) && is_array($request->agent_ids)) {
				foreach ($request->agent_ids as $agent_id) {
					$user = Agent::where(['agent_id' => $agent_id])->first();

					$validate = [
						'main' => [
							'check' => new Agent,
							'id' => $agent_id,
						],
						'with' => [
							['model' => new ChargeOrder],
						]
					];

					$response = $this->checkAndDelete($validate);
					if ($response['error']) {
						return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
					}


					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Agent successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
