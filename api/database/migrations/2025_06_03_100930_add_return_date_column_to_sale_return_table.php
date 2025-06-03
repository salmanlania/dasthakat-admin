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
        Schema::table('sale_return', function (Blueprint $table) {
            //
            $table->dateTime('return_date')->nullable()->after('ship_via');
        
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sale_return', function (Blueprint $table) {
            //
            $table->dropColumn('return_date');
        });
    }
};
