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
            $table->char('quotation_detail_id', 36)->after('purchase_order_detail_id');
            $table->string('internal_notes', 255)->after('quotation_detail_id');
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
            $table->dropColumn('quotation_detail_id');
            $table->dropColumn('internal_notes');
        });
    }
};
