<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserPermissionSeeder extends Seeder
{
    public function run()
    {
        DB::table('user_permission')->insert([
            'user_permission_id' => '8b705554-d9e6-4586-a404-4a55d9b601c3',
            'name' => 'Internal Team',
            'description' => 'Team Accounts',
            'permission' => json_encode([
                'user_permission' => ['list' => 1, 'add' => 1, 'edit' => 1, 'delete' => 1],
                'user' => ['list' => 1, 'add' => 1, 'edit' => 1, 'delete' => 1],
                'parlour-request' => ['list' => 1, 'add' => 1, 'edit' => 1, 'delete' => 1],
                'parlour-master' => ['list' => 1, 'add' => 1, 'edit' => 1, 'delete' => 1],
                'quote-request' => ['list' => 1, 'add' => 1, 'edit' => 1, 'delete' => 1],
                'product-category' => ['list' => 1, 'add' => 1, 'edit' => 1, 'delete' => 1],
                'product' => ['list' => 1, 'add' => 1, 'edit' => 1, 'delete' => 1],
                'setting' => ['list' => 1, 'add' => 1, 'edit' => 1, 'delete' => 1],

            ]),
            'is_deleted' => 0,
            'created_by' => null,
            'created_at' => '2024-08-06 08:44:23',
            'updated_by' => null,
            'updated_at' => '2024-09-11 11:39:35',
        ]);
    }
}