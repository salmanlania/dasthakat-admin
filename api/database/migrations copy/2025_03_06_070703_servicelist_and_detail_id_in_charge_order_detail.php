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
        Schema::table('charge_order_detail', function (Blueprint $table) {
            $table->char('servicelist_id', 36)->after('purchase_order_detail_id')->nullable();
            $table->char('servicelist_detail_id', 36)->after('servicelist_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('charge_order_detail', function (Blueprint $table) {
            $table->dropColumn(['servicelist_id', 'servicelist_detail_id']);
        });
    }
};
