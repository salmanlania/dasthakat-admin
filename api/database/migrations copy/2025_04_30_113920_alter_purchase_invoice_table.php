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

        Schema::table('purchase_invoice', function (Blueprint $table) {
            $table->dropColumn(['good_received_note_id','quotation_id']);
            $table->char('purchase_order_id', 36)->nullable()->after('charge_order_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('purchase_invoice', function (Blueprint $table) {
            $table->dropColumn('purchase_order_id');
            $table->char('good_received_note_id', 36)->nullable()->after('charge_order_id');
            $table->char('quotation_id', 36)->nullable()->after('good_received_note_id');
        });
    }
};
