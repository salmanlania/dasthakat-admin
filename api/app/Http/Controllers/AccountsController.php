<?php

namespace App\Http\Controllers;

use App\Models\AccountHeads;
use App\Models\Accounts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\ConstGlType;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AccountsController extends Controller
{
    public function index(Request $request)
    {
        $account_code    = $request->input('account_code', '');
        $parent_account_id = $request->input('parent_account_id', '');
        $exempt_account_id = $request->input('exempt_account_id', '');
        $head_account_id  = $request->input('head_account_id', '');
        $name           = $request->input('name', '');
        $gl_type_id     = $request->input('gl_type_id', '');
        $status         = $request->input('status', '');
        $search         = $request->input('search', '');
        $page           = $request->input('page', 1);
        $perPage        = $request->input('limit', 10);
        $sort_column    = $request->input('sort_column', 'c1.gl_type_id');
        $sort_direction = ($request->input('sort_direction', 'ascend') == 'ascend') ? 'asc' : 'desc';

        // Dynamic table names
        $accountsTable = (new Accounts())->getTable();
        $glTypeTable    = (new ConstGlType())->getTable();
        $headAccountTable = (new AccountHeads())->getTable();
        $data = Accounts::from($accountsTable . ' as c1')
            ->leftJoin($glTypeTable . ' as gl_type', 'c1.gl_type_id', '=', 'gl_type.gl_type_id')
            ->leftJoin($headAccountTable . ' as ah', 'c1.head_account_id', '=', 'ah.head_account_id')
            ->leftJoin($accountsTable . ' as parent', 'c1.parent_account_id', '=', 'parent.account_id');

        if (!empty($request->company_id)) {
            $data->where('c1.company_id', '=', $request->company_id);
        }
        if (!empty($exempt_account_id)) {
            $data->where('c1.account_id', '!=', $exempt_account_id);
        }
        if (!empty($head_account_id)) {
            $data->where('c1.head_account_id', '=', $head_account_id);
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

        if ($request->input('only_leaf', false)) {
            $data->whereNotExists(function ($q) use ($accountsTable) {
                $q->selectRaw(1)
                    ->from($accountsTable . ' as child')
                    ->whereRaw('child.parent_account_id = c1.account_id');
            });
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

        if ($request->input('exempt_referred_accounts', false)) {
            // Product references
            $data->whereNotExists(function ($q) {
                $q->selectRaw(1)
                    ->from('product')
                    ->whereColumn('product.cogs_account_id', 'c1.account_id')
                    ->orWhereColumn('product.inventory_account_id', 'c1.account_id')
                    ->orWhereColumn('product.revenue_account_id', 'c1.account_id')
                    ->orWhereColumn('product.adjustment_account_id', 'c1.account_id');
            });

            // Customer references
            $data->whereNotExists(function ($q) {
                $q->selectRaw(1)
                    ->from('customer')
                    ->whereColumn('customer.outstanding_account_id', 'c1.account_id');
            });

            // Supplier references
            $data->whereNotExists(function ($q) {
                $q->selectRaw(1)
                    ->from('supplier')
                    ->whereColumn('supplier.outstanding_account_id', 'c1.account_id');
            });

            // Settings table references
            $data->whereNotExists(function ($q) {
                $q->selectRaw(1)
                    ->from('setting')
                    ->whereRaw("JSON_VALID(setting.value)")
                    ->whereRaw("JSON_CONTAINS(setting.value, JSON_QUOTE(c1.account_id))");
            });
        }


        $data = $data->select('c1.*', 'gl_type.name as gl_type', 'ah.head_account_name', 'ah.head_account_type', 'parent.account_code as parent_account_code', 'parent.name as parent_account_name', DB::raw("CONCAT(c1.account_code, ' - ', c1.name) as display_account_name"), DB::raw("CONCAT(parent.account_code, ' - ', parent.name) as display_parent_account_name"))
            ->orderBy($sort_column, $sort_direction);
        if ($request->input('sort_column', '') == '') {
            $data = $data->orderBy('parent.name', 'asc');
        }

        $data = $data->paginate($perPage, ['*'], 'page', $page);

        if ($data->total() > 0) {
            foreach ($data->items() as $key => $value) {
                $nextCode = $this->getNextChildAccountCode($value->account_id);
                $data->items()[$key]->child_next_account_code = $nextCode;
            }
        }

        return response()->json($data);
    }
    private function getNextChildAccountCode($parentId)
    {
        $lastChild = Accounts::where('parent_account_id', $parentId)
            ->orderByRaw("CAST(SUBSTRING_INDEX(account_code, '-', -1) AS UNSIGNED) DESC")
            ->first();

        if (!$lastChild) {
            return null; // no children
        }

        $parts = explode('-', $lastChild->account_code);
        $lastPartRaw = end($parts);              // e.g. "01" or "002" or "215"
        $lastPartInt = intval($lastPartRaw);     // e.g. 1 or 2 or 215
        $paddingLength = strlen($lastPartRaw);   // e.g. 2 or 3

        $nextPart = str_pad($lastPartInt + 1, $paddingLength, '0', STR_PAD_LEFT);

        $parts[count($parts) - 1] = $nextPart;

        return implode('-', $parts);
    }
    public function getAccountHeads(Request $request)
    {
        $gl_type_id = $request->input('gl_type_id', '');
        $data = AccountHeads::query();

        if (!empty($gl_type_id)) {
            if (in_array($gl_type_id, [1, 2, 3])) {
                $data->where('head_account_type', 2);
            } else {
                $data->where('head_account_type', 1);
            }
        }

        $result = $data->get();
        return $this->jsonResponse($result, 200, 'Account Heads Data');
    }
    public function getAccountsTree(Request $request)
    {
        $gl_type_id = $request->input('gl_type_id', '');
        $parent_account_id = $request->input('parent_account_id', '');

        $query = Accounts::leftJoin('accounts as parent', 'parent.account_id', '=', 'accounts.parent_account_id')
            ->leftJoin('const_gl_type as gl_type', 'gl_type.gl_type_id', '=', 'accounts.gl_type_id')
            ->leftJoin('head_accounts as head', 'head.head_account_id', '=', 'accounts.head_account_id')
            ->where('accounts.company_id', $request->company_id);

        if (!empty($gl_type_id)) {
            $query->where('accounts.gl_type_id', $gl_type_id);
        }

        $accounts = $query->select(
            "accounts.*",
            "gl_type.name as gl_type_name",
            "parent.account_code as parent_account_code",
            "parent.name as parent_account_name",
            "head.head_account_name",
            "head.head_account_type"
        )->get()->toArray();

        // Build map
        $map = [];
        foreach ($accounts as $acc) {
            $acc['children'] = [];
            $acc['child_next_account_code'] = $this->getNextChildAccountCode($acc['account_id']); // ✅ Add next code here
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

        // Recursive sorting function
        $sortFn = function (&$nodes) use (&$sortFn) {
            usort($nodes, function ($a, $b) {
                return strcmp($a['account_code'], $b['account_code']);
            });
            foreach ($nodes as &$n) {
                if (!empty($n['children'])) {
                    $sortFn($n['children']);
                }
            }
        };

        // Sort the whole tree
        $sortFn($tree);

        // Filter by specific parent if needed
        if (!empty($parent_account_id) && isset($map[$parent_account_id])) {
            $tree = [$map[$parent_account_id]];
            $sortFn($tree); // sort this subtree too
        }

        return $this->jsonResponse($tree, 200, 'Accounts Data Tree');
    }




    public function show($id, Request $request)
    {
        $accountsTable = (new Accounts())->getTable();
        $glTypeTable = (new ConstGlType())->getTable();
        $headAccountTable = (new AccountHeads())->getTable();

        $data = Accounts::from($accountsTable . ' as c1')
            ->leftJoin($glTypeTable . ' as gl_type', 'c1.gl_type_id', '=', 'gl_type.gl_type_id')
            ->leftJoin($headAccountTable . ' as ah', 'c1.head_account_id', '=', 'ah.head_account_id')
            ->leftJoin($accountsTable . ' as parent', 'c1.parent_account_id', '=', 'parent.account_id')

            ->where('c1.account_id', $id)
            ->select('c1.*', 'gl_type.name as gl_type', 'ah.head_account_name', 'ah.head_account_type',  'parent.account_code as parent_account_code', 'parent.name as parent_account_name')
            ->first();

        return $this->jsonResponse($data, 200, 'Accounts Data');
    }

    protected function validateRequest($request, $id = null)
    {
        $rules = [
            'company_id'   => ['required'],
            'gl_type_id'   => ['required', 'integer'],
            'account_code'  => [
                'required',
                Rule::unique('accounts')
                    ->ignore($id, 'account_id')
                    ->where(function ($query) use ($request) {
                        return $query->where('company_id', $request['company_id'])
                            ->where('gl_type_id', $request['gl_type_id'])
                            ->where('parent_account_id', $request['parent_account_id']);
                    }),
            ],
            'name'         => ['required'],
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
            'head_account_id'   => $request->head_account_id ?? null,
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

        $newParentId = $request->input('parent_account_id', 0);

        if ($data->wouldCauseCycle($newParentId)) {
            return response()->json([
                'error' => 'Invalid Parent Account Selection: this would create a circular reference.'
            ], 422);
        }

        $data->company_id  = $request->company_id;
        $data->gl_type_id  = $request->gl_type_id ?? $data->gl_type_id;
        $data->account_code = $request->account_code ?? $data->account_code;
        $data->parent_account_id = $request->parent_account_id ?? "";
        $data->head_account_id = $request->head_account_id ?? $data->head_account_id;
        $data->name        = $request->name ?? $data->name;
        $data->status      = $request->status ?? $data->status;
        $data->updated_at  = Carbon::now();
        $data->updated_by  = $request->login_user_id;
        $data->update();

        return $this->jsonResponse(['account_id' => $id], 200, 'Update Account Successfully!');
    }
    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'accounts', $request->permission_list)) {
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');
        }

        $account = Accounts::where('account_id', $id)->first();
        if (!$account) {
            return $this->jsonResponse(['account_id' => $id], 404, 'Account Not Found!');
        }

        $childExists = Accounts::where('parent_account_id', $id)->exists();
        if ($childExists) {
            return $this->jsonResponse('Please delete child accounts first!', 400, 'Please delete child accounts first!');
        }

        $account->delete();
        return $this->jsonResponse(['account_id' => $id], 200, 'Account deleted successfully!');
    }


    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'accounts', $request->permission_list)) {
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');
        }

        if (!isset($request->account_ids) || !is_array($request->account_ids)) {
            return $this->jsonResponse('Invalid Request: account_ids must be an array', 400, 'Invalid Request: account_ids must be an array');
        }

        $notDeleted = [];
        $deleted = [];

        foreach ($request->account_ids as $account_id) {
            $account = Accounts::where('account_id', $account_id)->first();
            if (!$account) {
                $notDeleted[] = ['account_id' => $account_id, 'reason' => 'Account not found'];
                continue;
            }

            $childExists = Accounts::where('parent_account_id', $account_id)->exists();
            if ($childExists) {
                $notDeleted[] = ['account_id' => $account_id, 'reason' => 'Has child accounts'];
                continue;
            }

            $account->delete();
            $deleted[] = $account_id;
        }

        return $this->jsonResponse(
            ['deleted' => $deleted, 'not_deleted' => $notDeleted],
            200,
            'Accounts deleted successfully!' . (count($notDeleted) > 0 ? ' Some accounts could not be deleted because they have child accounts.' : '')
        );
    }
}
