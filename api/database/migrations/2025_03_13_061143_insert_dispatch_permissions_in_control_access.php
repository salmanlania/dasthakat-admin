<?php

use App\Models\ControlAccess;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
            ['module_name' => 'Warehousing', 'form_name' => 'Dispatch', 'route' => 'dispatch', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Warehousing', 'form_name' => 'Dispatch', 'route' => 'dispatch', 'permission_id' => 'update', 'permission_name' => 'Update', 'sort_order' => 1.102],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        ControlAccess::where('module_name', 'Warehousing')->where('form_name', 'Dispatch')->delete();
    }
};
