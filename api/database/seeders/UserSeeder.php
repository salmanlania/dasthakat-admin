<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyBranch;
use App\Models\User;
use App\Models\UserBranchAccess;
use App\Models\UserPermission;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{

    public function run()
    {
        $user_id = Str::uuid()->toString();
        $permission = UserPermission::first();
        $company = Company::first();
        $company_branch = CompanyBranch::first();
        User::insert([
            [
                'company_id' => $company['company_id'],
                'permission_id' => $permission['user_permission_id'],
                'user_id' => $user_id,
                'email' => 'admin@gmail.com',
                'password' => md5(12345678),
                'user_name' => 'Super Admin',
                'status' => 1,
                'super_admin' => 1,
                'created_at' => Carbon::now(),
            ]
        ]);

        $access_id = Str::uuid()->toString();
        UserBranchAccess::insert([
            [
                'user_branch_access_id' => $access_id,
                'company_id' => $company['company_id'],
                'company_branch_id' => $company_branch['company_branch_id'],
                'user_id' => $user_id,
                'created_at' => Carbon::now(),
            ]
        ]);
    }
}
