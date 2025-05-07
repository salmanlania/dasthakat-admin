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

        Schema::table('purchase_invoice_detail', function (Blueprint $table) {
            $table->dropColumn('po_quantity');
            $table->decimal('po_price', 10,2)->default(0.00)->after('quantity');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('purchase_invoice_detail', function (Blueprint $table) {
            $table->decimal('po_quantity', 10,2)->default(0.00)->after('quantity');
            $table->dropColumn('po_price');
        });
    }
};
