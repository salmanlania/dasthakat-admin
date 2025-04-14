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
            ['module_name' => 'System', 'form_name' => 'Settings', 'route' => 'setting', 'permission_id' => 'update', 'permission_name' => 'Update', 'sort_order' => 1.101],

        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        ControlAccess::where('module_name', 'System')->where('form_name', 'Setting')->delete();
    }
};
