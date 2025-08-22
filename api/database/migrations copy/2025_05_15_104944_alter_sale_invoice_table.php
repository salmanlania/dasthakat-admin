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
        Schema::table('sale_invoice', function (Blueprint $table) {
            $table->string('vessel_billing_address', 255)->nullable()->after('document_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sale_invoice', function (Blueprint $table) {
            $table->dropColumn('vessel_billing_address');
        });
    }
};
