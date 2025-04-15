<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('company', function (Blueprint $table) {
            $table->boolean('is_exempted')->default(0)->after('base_currency_id');
        });
    }

    public function down()
    {
        Schema::table('company', function (Blueprint $table) {
            $table->dropColumn('is_exempted');
        });
    }
};
