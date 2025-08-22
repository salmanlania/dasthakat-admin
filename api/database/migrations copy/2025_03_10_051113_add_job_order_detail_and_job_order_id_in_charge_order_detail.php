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
        
            $table->char('job_order_id', 36)->after('quotation_detail_id')->nullable();
            $table->char('job_order_detail_id', 36)->after('job_order_id')->nullable();
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
            // Drop new columns
            $table->dropColumn(['job_order_id', 'job_order_detail_id']);
        });
    }
};
