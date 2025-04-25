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
        Schema::table('job_order', function (Blueprint $table) {
            $table->dropColumn('flag');
            $table->dropColumn('class1');
            $table->dropColumn('class2');

        });
        Schema::table('job_order', function (Blueprint $table) {
            $table->char('flag_id', 36)->nullable();
            $table->char('class1_id', 36)->nullable();
            $table->char('class2_id', 36)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_order', function (Blueprint $table) {
            $table->dropColumn('flag_id');
            $table->dropColumn('class1_id');
            $table->dropColumn('class2_id');
        });
        Schema::table('job_order', function (Blueprint $table) {
            $table->string('flag', 255)->nullable();
            $table->string('class1', 255)->nullable();
            $table->string('class2', 255)->nullable();
        });
    }
};
