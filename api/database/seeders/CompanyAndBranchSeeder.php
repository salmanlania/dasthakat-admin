<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyBranch;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Str;

class CompanyAndBranchSeeder extends Seeder
{

    public function run()
    {
        $company_id = Str::uuid()->toString();
        $company_branch_id = Str::uuid()->toString();
        $company = [
            ['company_id' => $company_id, 'name' => 'Bharmal System Designer', 'created_at' => Carbon::now()],
        ];
        Company::insert($company);

        $branch = [
            ['company_id' => $company_id,'company_branch_id' =>$company_branch_id, 'name' => 'Karachi','branch_code'=>'KHI', 'created_at' => Carbon::now()],
        ];
        CompanyBranch::insert($branch);
    }
}
