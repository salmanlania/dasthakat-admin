<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('user')->insert([
            'id' => '0e683be4-af16-44eb-8bad-db9fbebee88c',
            'user_type' => 'Internal',
            'permission_id' => '8b705554-d9e6-4586-a404-4a55d9b601c3',
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => 'e14c05f0dc27e6be1fc127abaf474a59', // Use bcrypt for hashed password Demo@123
            'phone_no' => '',
            'country_id' => null,
            'site_url' => null,
            'dealer_id' => null,
            'organization' => null,
            'postal_code' => null,
            'address' => null,
            'api_token' => null,
            'status' => 1,
            'image' => null,
            'is_deleted' => 0,
            'is_change_password' => 1,
            'last_login' => '2024-08-26 11:17:54',
            'created_by' => null,
            'created_at' => '2024-08-26 09:40:11',
            'updated_by' => null,
            'updated_at' => '2024-08-28 09:20:03',
        ]);
    }
}