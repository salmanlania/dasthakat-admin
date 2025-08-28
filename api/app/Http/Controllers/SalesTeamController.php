<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\SalesTeam;

class SalesTeamController extends Controller
{
    public function index(Request $request)
    {
        $name = $request->input('name', '');
        $search = $request->input('search', '');
        $page =  $request->input('page', 1);
        $perPage =  $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $data = new SalesTeam;
        $data = $data->where('company_id', '=', $request->company_id);
        $data = $data->where('company_branch_id', '=', $request->company_branch_id);
        if (!empty($name)) $data = $data->where('name', 'like', '%' . $name . '%');

        if (!empty($search)) {
            $search = strtolower($search);
            $data = $data->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            });
        }

        $data = $data->select('*');
        $data = $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function show($id, Request $request)
    {
        $data = SalesTeam::where('sales_team_id', $id)->first();
        return $this->jsonResponse($data, 200, 'Sales Team Data');
    }

    private function validateRequest($request, $id = null)
    {
        $rules = [
            'name' => ['required', Rule::unique('sales_team')->ignore($id, 'sales_team_id')->where('company_id', $request['company_id'])->where('company_branch_id', $request['company_branch_id'])],
        ];

        $validator = Validator::make($request, $rules);
        if ($validator->fails()) {
            $firstError = $validator->errors()->first();
            return $firstError;
        }
        return [];
    }

    public function store(Request $request)
    {
        if (!isPermission('add', 'sales_team', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all());
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        $uuid = $this->get_uuid();

        $insertArr = [
            'company_id' => $request->company_id ?? '',
            'company_branch_id' => $request->company_branch_id ?? '',
            'sales_team_id' => $uuid,
            'name' => $request->name ?? '',
            'created_at' => date('Y-m-d H:i:s'),
            'created_by' => $request->login_user_id,
        ];

        SalesTeam::create($insertArr);

        return $this->jsonResponse(['sales_team_id' => $uuid], 200, 'Add Sales Team Successfully!');
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'sales_team', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all(), $id);
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        $data = SalesTeam::where('sales_team_id', $id)->first();
        if (!$data) return $this->jsonResponse(['sales_team_id' => $id], 404, 'Sales Team Not Found!');

        $data->company_id = $request->company_id;
        $data->company_branch_id = $request->company_branch_id;
        $data->name = $request->name ?? '';
        $data->updated_at = date('Y-m-d H:i:s');
        $data->updated_by = $request->login_user_id;
        $data->update();

        return $this->jsonResponse(['sales_team_id' => $id], 200, 'Update Sales Team Successfully!');
    }

    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'sales_team', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $data = SalesTeam::where('sales_team_id', $id)->first();
        if (!$data) return $this->jsonResponse(['sales_team_id' => $id], 404, 'Sales Team Not Found!');

        // If any dependency checks are needed, add similar to AgentController@delete
        $data->delete();
        return $this->jsonResponse(['sales_team_id' => $id], 200, 'Delete Sales Team Successfully!');
    }

    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'sales_team', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        try {
            if (isset($request->sales_team_ids) && !empty($request->sales_team_ids) && is_array($request->sales_team_ids)) {
                foreach ($request->sales_team_ids as $sid) {
                    $row = SalesTeam::where(['sales_team_id' => $sid])->first();
                    if ($row) {
                        $row->delete();
                    }
                }
            }
            return $this->jsonResponse('Deleted', 200, 'Delete Sales Team successfully!');
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
