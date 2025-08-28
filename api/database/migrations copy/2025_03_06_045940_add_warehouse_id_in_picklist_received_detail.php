<?php

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
        Schema::table('picklist_received_detail', function (Blueprint $table) {
            $table->char('warehouse_id', 36)->after('product_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('picklist_received_detail', function (Blueprint $table) {
            $table->dropColumn('warehouse_id');
        });
    }
};
