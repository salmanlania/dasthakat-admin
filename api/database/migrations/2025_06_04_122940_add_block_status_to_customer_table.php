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
        Schema::table('customer', function (Blueprint $table) {
            //
            Schema::table('customer', function (Blueprint $table) {
                $table->char('block_status', 36)->default('no')->after('phone_no');
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('customer', function (Blueprint $table) {
            //
            Schema::table('customer', function (Blueprint $table) {
                $table->dropColumn('block_status');
            });
        });
    }
};
