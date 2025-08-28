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
            $table->dropColumn('document_no');
        });
        
        Schema::table('purchase_invoice', function (Blueprint $table) {
            $table->integer('document_no')->nullable()->after('document_type_id');
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
            $table->dropColumn('document_no');
        });
        
        Schema::table('purchase_invoice', function (Blueprint $table) {
            $table->string('document_no',100)->nullable()->after('document_type_id');
        });
    }
};
