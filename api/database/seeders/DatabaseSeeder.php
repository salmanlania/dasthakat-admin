<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            ControlAccessSeeder::class,
            CompanyAndBranchSeeder::class,
            DocumentTypeSeeder::class,
            UserPermissionSeeder::class,
            UserSeeder::class,
            ProductTypeSeeder::class,
        ]);
    }
}
