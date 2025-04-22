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
        Schema::table('picklist_received', function (Blueprint $table) {
            $table->char('charge_order_id', 36)->default(null)->nullable()->after('picklist_id');
        });
        Schema::table('picklist_received_detail', function (Blueprint $table) {
            $table->char('charge_order_detail_id', 36)->default(null)->nullable()->after('picklist_received_detail_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('picklist_received', function (Blueprint $table) {
            $table->dropColumn('charge_order_id');
        });
        Schema::table('picklist_received_detail', function (Blueprint $table) {
            $table->dropColumn('charge_order_detail_id');
        });
    }
};
