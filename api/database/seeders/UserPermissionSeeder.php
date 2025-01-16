<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyBranch;
use App\Models\ControlAccess;
use App\Models\UserPermission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UserPermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = $this->getPermissionsFromControlAccess();
        $user_permission_id = Str::uuid()->toString();
        $company = Company::first();
        $company_branch = CompanyBranch::where('company_id', $company['company_id'])->first();
        UserPermission::insert([
            [
                'company_id' => $company['company_id'],
                'company_branch_id' => $company_branch['company_branch_id'],
                'user_permission_id' => $user_permission_id,
                'name' => 'Admin Access',
                'description' => 'Has full access to all company and branch functionalities.',
                'permission' => json_encode($permissions),
                'created_at' => Carbon::now(),
            ]
        ]);
    }

    private function getPermissionsFromControlAccess()
    {

        $controlAccess = ControlAccess::select('route', 'permission_id')->get();
        $permissions = [];

        foreach ($controlAccess as $entry) {
            if (!isset($permissions[$entry->route])) {
                $permissions[$entry->route] = [];
            }
            $permissions[$entry->route][$entry->permission_id] = 1;
        }
        return $permissions;
    }
}
