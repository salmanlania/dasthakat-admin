<?php

namespace App\Http\Controllers;


use App\Models\Accounts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\ConstGlType;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AccountsController extends Controller
{
    public function index(Request $request)
    {
        $account_code    = $request->input('account_code', '');
        $parent_account_id = $request->input('parent_account_id', '');
        $exempt_account_id = $request->input('exempt_account_id', '');
       
        $name           = $request->input('name', '');
        $gl_type_id     = $request->input('gl_type_id', '');
        $status         = $request->input('status', '');
        $search         = $request->input('search', '');
        $page           = $request->input('page', 1);
        $perPage        = $request->input('limit', 10);
        $sort_column    = $request->input('sort_column', 'c1.created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        // Dynamic table names
        $accountsTable = (new Accounts())->getTable();
        $glTypeTable    = (new ConstGlType())->getTable();

        $data = Accounts::from($accountsTable . ' as c1')
            ->join($glTypeTable . ' as gl_type', 'c1.gl_type_id', '=', 'gl_type.gl_type_id')
            ->leftJoin($accountsTable . ' as parent', 'c1.parent_account_id', '=', 'parent.account_id');

        if (!empty($request->company_id)) {
            $data->where('c1.company_id', '=', $request->company_id);
        }
        if (!empty($exempt_account_id)) {
            $data->where('c1.account_id', '!=', $exempt_account_id);
        }
        if (!empty($parent_account_id)) {
            $data->where('c1.parent_account_id', '=', $parent_account_id);
        }


        if (!empty($account_code)) {
            $data->where('c1.account_code', 'like', '%' . $account_code . '%');
        }
        if (!empty($name)) {
            $data->where('c1.name', 'like', '%' . $name . '%');
        }
        if ($gl_type_id !== '' && $gl_type_id !== null) {
            $data->where('c1.gl_type_id', $gl_type_id);
        }
        if ($status !== '' && $status !== null) {
            $data->where('c1.status', $status);
        }

        if (!empty($search)) {
            $s = strtolower($search);
            $data->where(function ($q) use ($s) {
                $q->where('c1.name', 'like', '%' . $s . '%')
                    ->orWhere('c1.account_code', 'like', '%' . $s . '%')
                    ->orWhere('gl_type.name', 'like', '%' . $s . '%')
                    ->orWhere('parent.name', 'like', '%' . $s . '%');
            });
        }

        $data = $data->select('c1.*', 'gl_type.name as gl_type', 'parent.account_code as parent_account_code', 'parent.name as parent_account_name')
            ->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function getAccountsTree(Request $request)
    {
        $gl_type_id = $request->input('gl_type_id', '');
        $parent_account_id = $request->input('parent_account_id', '');

        $query = Accounts::query();

        // If filtering by GL type
        if (!empty($gl_type_id)) {
            $query->where('gl_type_id', $gl_type_id);
        }

        // Always fetch ALL accounts matching GL type (so recursion works)
        $accounts = $query->select("accounts.*")->get()->toArray();

        // Build map of accounts
        $map = [];
        foreach ($accounts as $acc) {
            $acc['children'] = [];
            $map[$acc['account_id']] = $acc;
        }

        // Build hierarchy
        $tree = [];
        foreach ($map as $id => &$node) {
            if (!empty($node['parent_account_id']) && isset($map[$node['parent_account_id']])) {
                $map[$node['parent_account_id']]['children'][] = &$node;
            } else {
                $tree[] = &$node;
            }
        }

        // If filtering by a parent account → extract its subtree
        if (!empty($parent_account_id) && isset($map[$parent_account_id])) {
            $tree = [$map[$parent_account_id]]; // return only this subtree
        }

        return $this->jsonResponse($tree, 200, 'Accounts Data Tree');
    }



    public function show($id, Request $request)
    {
        $accountsTable = (new Accounts())->getTable();
        $glTypeTable = (new ConstGlType())->getTable();

        $data = Accounts::from($accountsTable . ' as c1')
            ->join($glTypeTable . ' as gl_type', 'c1.gl_type_id', '=', 'gl_type.gl_type_id')
            ->leftJoin($accountsTable . ' as parent', 'c1.parent_account_id', '=', 'parent.account_id')

            ->where('c1.account_id', $id)
            ->select('c1.*', 'gl_type.name as gl_type', 'parent.account_code as parent_account_code', 'parent.name as parent_account_name')
            ->first();

        return $this->jsonResponse($data, 200, 'Accounts Data');
    }

    protected function validateRequest($request, $id = null)
    {
        $rules = [
            'company_id'   => ['required'],
            'gl_type_id'   => ['required', 'integer'],
            'account_code'  => ['required', Rule::unique('accounts')->ignore($id, 'account_id')->where('company_id', $request['company_id'])],
            'name'         => ['required', Rule::unique('accounts')->ignore($id, 'account_id')->where('company_id', $request['company_id'])],
            'status'       => ['nullable', 'integer']
        ];

        $validator = Validator::make($request, $rules);
        if ($validator->fails()) {
            return $validator->errors()->first();
        }
        return [];
    }

    public function store(Request $request)
    {
        if (!isPermission('add', 'accounts', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all());
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        $uuid = $this->get_uuid();
        $insertArr = [
            'account_id' => $uuid,
            'company_id'    => $request->company_id ?? '',
            'gl_type_id'    => $request->gl_type_id ?? null,
            'account_code'   => $request->account_code ?? '',
            'parent_account_id'   => $request->parent_account_id ?? null,
            'name'          => $request->name ?? '',
            'status'        => $request->status ?? 1,
            'created_at'    => Carbon::now(),
            'created_by'    => $request->login_user_id,
        ];

        Accounts::create($insertArr);
        return $this->jsonResponse(['account_id' => $uuid], 200, 'Add Account Successfully!');
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'accounts', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all(), $id);
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        $data = Accounts::where('account_id', $id)->first();
        if (!$data) return $this->jsonResponse('Record not found', 404, 'Not Found');

        $data->company_id  = $request->company_id;
        $data->gl_type_id  = $request->gl_type_id ?? $data->gl_type_id;
        $data->account_code = $request->account_code ?? $data->account_code;
        $data->parent_account_id = $request->parent_account_id ?? "";
        $data->name        = $request->name ?? $data->name;
        $data->status      = $request->status ?? $data->status;
        $data->updated_at  = Carbon::now();
        $data->updated_by  = $request->login_user_id;
        $data->update();

        return $this->jsonResponse(['account_id' => $id], 200, 'Update Account Successfully!');
    }

    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'accounts', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $data = Accounts::where('account_id', $id)->first();
        if (!$data) return $this->jsonResponse(['account_id' => $id], 404, 'Account Not Found!');

        // $validate = [
        //     'main' => [
        //         'check' => new Accounts,
        //         'id'    => $id,
        //     ],
        //     'with' => [
        //         ['model' => new CoaLevel2],
        //     ]
        // ];

        // $response = $this->checkAndDelete($validate);
        // if ($response['error']) {
        //     return $this->jsonResponse($response['msg'], $response['error_code'], 'Deletion Failed!');
        // }

        $data->delete();
        return $this->jsonResponse(['account_id' => $id], 200, 'Delete Account Successfully!');
    }

    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'accounts', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        try {
            if (isset($request->account_ids) && is_array($request->account_ids)) {
                foreach ($request->account_ids as $account_id) {
                    $row = Accounts::where('account_id', $account_id)->first();
                    if (!$row) continue;

                    // $validate = [
                    //     'main' => [
                    //         'check' => new Accounts,
                    //         'id'    => $account_id,
                    //     ],
                    //     'with' => [
                    //         ['model' => new CoaLevel2],
                    //     ]
                    // ];

                    // $response = $this->checkAndDelete($validate);
                    // if ($response['error']) {
                    //     return $this->jsonResponse($response['msg'], $response['error_code'], 'Deletion Failed!');
                    // }

                    $row->delete();
                }
            }
            return $this->jsonResponse('Deleted', 200, 'Delete Account successfully!');
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
