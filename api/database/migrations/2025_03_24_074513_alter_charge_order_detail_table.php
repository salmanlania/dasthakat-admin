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
            $table->char('shipment_id', 36)->nullable()->after('purchase_order_detail_id');
            $table->char('shipment_detail_id', 36)->nullable()->after('shipment_id');
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
            $table->dropColumn([
                'shipment_id',
                'shipment_detail_id',
            ]);
        });
    }
};
