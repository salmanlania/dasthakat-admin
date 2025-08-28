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
        Schema::table('job_order_detail_certificate', function (Blueprint $table) {
            $table->integer('sort_order')->after('job_order_id')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_order_detail_certificate', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};
