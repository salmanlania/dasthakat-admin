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
        Schema::table('vessel', function (Blueprint $table) {
            //
            Schema::table('vessel', function (Blueprint $table) {
                $table->char('block_status', 36)->nullable()->after('flag_id');
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
        Schema::table('vessel', function (Blueprint $table) {
            //
            Schema::table('vessel', function (Blueprint $table) {
                $table->dropColumn('block_status');
            });
        });
    }
};
