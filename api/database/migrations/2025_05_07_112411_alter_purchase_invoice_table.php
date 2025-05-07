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
            $table->string('vendor_invoice_no', 100)->nullable()->after('document_identity');
            $table->decimal('freight', 10, 2)->default(0.00)->after('remarks');
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
            $table->dropColumn(['freight', 'vendor_invoice_no']);
        });
    }
};
