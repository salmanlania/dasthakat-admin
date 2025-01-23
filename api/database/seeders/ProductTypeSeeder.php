<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyBranch;
use App\Models\ProductType;
use App\Models\User;
use App\Models\UserBranchAccess;
use App\Models\UserPermission;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ProductTypeSeeder extends Seeder
{

    public function run()
    {
        ProductType::insert([
            [
                'product_type_id' => 1,
                'name' => 'Service',
                'created_at' => Carbon::now(),
            ],
            [
                'product_type_id' => 2,
                'name' => 'Inventory',
                'created_at' => Carbon::now(),
            ],
            [
                'product_type_id' => 3,
                'name' => 'IMPA',
                'created_at' => Carbon::now(),
            ],
            [
                'product_type_id' => 4,
                'name' => 'Others',
                'created_at' => Carbon::now(),
            ],
        ]);
    }
}
