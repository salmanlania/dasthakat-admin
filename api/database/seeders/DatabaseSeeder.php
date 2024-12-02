<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Database\Seeders\ControlAccessSeeder;
use App\Database\Seeders\UserSeeder;
use App\Database\Seeders\UserPermissionSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ControlAccessSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(UserPermissionSeeder::class);
    }
}


