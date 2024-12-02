<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ControlAccessSeeder extends Seeder
{
    public function run()
    {
        DB::table('control_access')->insert([
            ['control_access_id' => 1, 'module_name' => 'Administrator', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['control_access_id' => 2, 'module_name' => 'Administrator', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['control_access_id' => 3, 'module_name' => 'Administrator', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['control_access_id' => 4, 'module_name' => 'Administrator', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],
            ['control_access_id' => 5, 'module_name' => 'Administrator', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.201],
            ['control_access_id' => 6, 'module_name' => 'Administrator', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.202],
            ['control_access_id' => 7, 'module_name' => 'Administrator', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.203],
            ['control_access_id' => 8, 'module_name' => 'Administrator', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 9, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Master', 'route' => 'parlour-master', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.201],
            ['control_access_id' => 10, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Master', 'route' => 'parlour-master', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.202],
            ['control_access_id' => 11, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Master', 'route' => 'parlour-master', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.203],
            ['control_access_id' => 12, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Master', 'route' => 'parlour-master', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 13, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Request', 'route' => 'parlour-request', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.201],
            ['control_access_id' => 14, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Request', 'route' => 'parlour-request', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.202],
            ['control_access_id' => 15, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Request', 'route' => 'parlour-request', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.203],
            ['control_access_id' => 16, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Request', 'route' => 'parlour-request', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
        ]);
    }
}