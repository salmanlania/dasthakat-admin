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
        Schema::table('good_received_note_detail', function (Blueprint $table) {
            $table->char('charge_order_detail_id', 36)->default(null)->nullable()->after('good_received_note_detail_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('good_received_note_detail', function (Blueprint $table) {
            $table->dropColumn('charge_order_id');
        });
    }
};
