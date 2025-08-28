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

        Schema::table('job_order_detail', function (Blueprint $table) {
            $table->dropColumn('internal_notes');
        });
        Schema::table('job_order_detail', function (Blueprint $table) {
            $table->string('internal_notes', 255)->nullable()->after('product_type_id');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_order_detail', function (Blueprint $table) {
            $table->dropColumn('internal_notes');
        });
        Schema::table('job_order_detail', function (Blueprint $table) {
            $table->string('internal_notes', 255)->nullable(false)->after('product_type_id');
        });
    }
};
