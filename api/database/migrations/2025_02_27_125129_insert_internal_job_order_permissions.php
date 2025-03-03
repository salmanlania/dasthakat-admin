<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        DB::table('control_access')->insert([
            [
                'module_name' => 'Sale Management',
                'form_name' => 'Internal Job Order',
                'route' => 'job_order',
                'permission_id' => 'list',
                'permission_name' => 'List',
                'sort_order' => 1.101
            ],
            [
                'module_name' => 'Sale Management',
                'form_name' => 'Internal Job Order',
                'route' => 'job_order',
                'permission_id' => 'add',
                'permission_name' => 'Add',
                'sort_order' => 1.102
            ],
            [
                'module_name' => 'Sale Management',
                'form_name' => 'Internal Job Order',
                'route' => 'job_order',
                'permission_id' => 'edit',
                'permission_name' => 'Edit',
                'sort_order' => 1.103
            ],
            [
                'module_name' => 'Sale Management',
                'form_name' => 'Internal Job Order',
                'route' => 'job_order',
                'permission_id' => 'delete',
                'permission_name' => 'Delete',
                'sort_order' => 1.104
            ],
        ]);
    }

    public function down()
    {
        DB::table('control_access')->where('route', 'job_order')->delete();
    }
};
