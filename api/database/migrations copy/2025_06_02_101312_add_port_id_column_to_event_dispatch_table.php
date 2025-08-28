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
        Schema::table('event_dispatch', function (Blueprint $table) {
            //
            $table->char('port_id',36)->nullable()->after('technician_notes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('event_dispatch', function (Blueprint $table) {
            
            $table->dropColumn('port_id');
        });
    }
};
