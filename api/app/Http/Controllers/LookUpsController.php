<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyBranch;
use Illuminate\Database\DatabaseManager;
use App\Models\Country;
use App\Models\ControlAccess;
use App\Models\ParlourModule;
use App\Models\EmailTemplate;
use App\Models\ProductType;
use App\Models\User;
use App\Models\UserBranchAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LookUpsController extends Controller
{
    protected $db;


    public function getModules()
    {

        $controls = ControlAccess::orderBy('sort_order', 'asc')->get();

        $arrPermissions = [];
        foreach ($controls as $permission) {
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
    public function getProductTypes()
    {
        $rows = ProductType::get();

        return response()->json($rows);
    }

    

    public function getCompany(Request $request)
    {
        $data = new Company;
        
        if(isset($request->login_user_id) && !empty($request->login_user_id)){
            $user = User::where('user_id','=' ,$request->login_user_id)->first();
            if($user['super_admin'] != 1){
                $data = $data->where('company_id','=',$user['company_id']);
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
        $branchList = ($user_access->pluck('company_branch_id','company_branch_id'));
        
        $companies = Company::with('branches');
        if($user_data['super_admin'] != 1)
           $companies = $companies->whereIn('company_id', $company);
        $companies = $companies->get();

        $groupedData = [];

        foreach ($companies as $company) {
            $branches = [];


            foreach ($company->branches as $branch) {

                if($user_data['super_admin'] == 1 || isset($branchList[$branch->company_branch_id])){
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
