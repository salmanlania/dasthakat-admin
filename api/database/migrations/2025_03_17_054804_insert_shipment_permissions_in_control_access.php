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
            ['module_name' => 'Sale Management', 'form_name' => 'Shipment', 'route' => 'shipment', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Sale Management', 'form_name' => 'Shipment', 'route' => 'shipment', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Sale Management', 'form_name' => 'Shipment', 'route' => 'shipment', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Sale Management', 'form_name' => 'Shipment', 'route' => 'shipment', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        ControlAccess::where('module_name', 'Sale Management')->where('form_name', 'Shipment')->delete();
    }
};
