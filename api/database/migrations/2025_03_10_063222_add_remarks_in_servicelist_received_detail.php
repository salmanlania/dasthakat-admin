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
        Schema::table('servicelist_received_detail', function (Blueprint $table) {
                $table->string('remarks', 255)->nullable()->after('product_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('servicelist_received_detail', function (Blueprint $table) {
            $table->dropColumn('remarks');
        });
    }
};
