<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('event_dispatch', function (Blueprint $table) {
            $table->dropColumn('technician_id');
        });
        Schema::table('event_dispatch', function (Blueprint $table) {
            $table->json('technician_id')->default(null)->after('event_id');
        });
    }

    public function down()
    {
        Schema::table('event_dispatch', function (Blueprint $table) {
            $table->dropColumn('technician_id');
        });
        Schema::table('event_dispatch', function (Blueprint $table) {
            $table->char('technician_id',36)->default(null)->after('event_id');
        });
    }
};
