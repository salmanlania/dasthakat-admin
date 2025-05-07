<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyBranch;
use App\Models\ControlAccess;
use App\Models\Product;
use App\Models\ProductType;
use App\Models\User;
use App\Models\UserBranchAccess;
use Illuminate\Http\Request;

class LookUpsController extends Controller
{
    protected $db;


    public function getModules(Request $request)
    {

        $controls = ControlAccess::orderBy('sort_order', 'asc')->get();

        $arrPermissions = [];
        $is_admin = (bool)$request['user']['super_admin'];


        foreach ($controls as $permission) {
            if (($permission->form_name == 'Company' || $permission->form_name == 'Company Branch') && !$is_admin) {
                continue;
            }
            $module_name       = $permission->module_name;
            $form_name         = $permission->form_name;
            $control_access_id = $permission->control_access_id;
            $route             = $permission->route;
            $permission_id     = $permission->permission_id;
            $permission_name   = $permission->permission_name;

            $arrPermissions[$module_name][$form_name][] = [
                'control_access_id' => $control_access_id,
                'route'             => $route,
                'permission_id'     => $permission_id,
                'permission_name'   => $permission_name,
                'selected'          => 0,
            ];
        }

        return response()->json($arrPermissions);
    }
    public function getProductTypes(Request $request)
    {
        $isOtherOption = $request->input('include_other', '1');
        $rows = new ProductType;
        if ($isOtherOption == '0') {
            $rows = $rows->where('product_type_id', '!=', 4);
        }
        $rows = $rows->get();


        return response()->json($rows);
    }



    public function getCompany(Request $request)
    {
        $data = new Company;

        if (isset($request->login_user_id) && !empty($request->login_user_id)) {
            $user = User::where('user_id', '=', $request->login_user_id)->first();
            if ($user['super_admin'] != 1) {
                $data = $data->where('company_id', '=', $user['company_id']);
            }
        }
        $data = $data->get();
        $arrModules = [];
        foreach ($data as $row) {
            $arrModules[] = [
                'value' => $row->company_id,
                'label' => $row->name,
            ];
        }

        return response()->json($arrModules);
    }
    public function getShortCodes(Request $request)
    {
        $name = $request->input('name', '');
        $page =  $request->input('page', 1);
        $perPage =  $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $data = Product::query();
        $data = $data->where('company_id', '=', $request->company_id);
        $data = $data->where('company_branch_id', '=', $request->company_branch_id);
        $data = $data->where('short_code', '!=', "");
        $data = $data->where('short_code', '!=', null);
        $data = $data->where('product.status', '=', 1);
        if (!empty($name)) $data = $data->where('name', 'like', '%' . $name . '%');
        if (!empty($search)) {
            $search = strtolower($search);
            $data = $data->where(function ($query) use ($search) {
                $query
                    ->where('short_code', 'like', '%' . $search . '%');
            });
        }

        $data = $data->select("product_id", "short_code");
        $data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }
    public function getCompanyBranch(Request $request)
    {
        $companyId = $request->input('company_id');
        $query = CompanyBranch::query();

        if (!empty($companyId)) {
            $query->where('company_id', $companyId);
        }
        $data = $query->get();
        $arrModules = [];
        foreach ($data as $row) {
            $arrModules[] = [
                'value' => $row->company_branch_id,
                'label' => $row->name,
            ];
        }

        return response()->json($arrModules);
    }
    public function getCompanyAndBranches(Request $request)
    {
        $id = $request->login_user_id;
        $user_data = User::where('user_id', $id)->first();
        $user_access = UserBranchAccess::where('user_id', $id);
        $company = array_unique($user_access->pluck('company_id')->toArray());
        $branchList = ($user_access->pluck('company_branch_id', 'company_branch_id'));

        $companies = Company::with('branches');
        if ($user_data['super_admin'] != 1)
            $companies = $companies->whereIn('company_id', $company);
        $companies = $companies->get();

        $groupedData = [];

        foreach ($companies as $company) {
            $branches = [];


            foreach ($company->branches as $branch) {

                if ($user_data['super_admin'] == 1 || isset($branchList[$branch->company_branch_id])) {
                    $branches[] = [
                        'branch_id' => $branch->company_branch_id,
                        'branch_name' => $branch->name,
                    ];
                }
            }

            $groupedData[] = [
                'company_id' => $company->company_id,
                'company_name' => $company->name,
                'branches' => $branches,
            ];
        }

        return response()->json($groupedData);
    }
}
