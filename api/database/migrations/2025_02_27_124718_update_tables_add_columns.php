<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
    

        Schema::table('supplier', function (Blueprint $table) {
            $table->char('payment_id', 36)->after('location');
        });

        Schema::table('quotation_detail', function (Blueprint $table) {
            $table->string('internal_notes', 255)->after('vendor_part_no');
        });

        Schema::table('purchase_order_detail', function (Blueprint $table) {
            $table->char('charge_order_detail_id', 36)->after('purchase_order_detail_id');
        });
    }

    public function down()
    {
   
        Schema::table('supplier', function (Blueprint $table) {
            $table->dropColumn('payment_id');
        });

        Schema::table('quotation_detail', function (Blueprint $table) {
            $table->dropColumn('internal_notes');
        });

        Schema::table('purchase_order_detail', function (Blueprint $table) {
            $table->dropColumn('charge_order_detail_id');
        });
    }
};
