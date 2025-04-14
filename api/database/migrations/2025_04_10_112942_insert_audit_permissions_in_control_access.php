<?php

use App\Models\ControlAccess;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        ControlAccess::insert([
            ['module_name' => 'System', 'form_name' => 'Audit', 'route' => 'audit', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'System', 'form_name' => 'Audit', 'route' => 'audit', 'permission_id' => 'view', 'permission_name' => 'View', 'sort_order' => 1.103],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        ControlAccess::where('module_name', 'System')->where('form_name', 'Audit')->delete();
    }
};
