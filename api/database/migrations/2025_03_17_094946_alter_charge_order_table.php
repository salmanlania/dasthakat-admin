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
        Schema::table('charge_order', function (Blueprint $table) {
            $table->text('agent_notes')->nullable()->after('agent_id');
            $table->json('technician_id')->nullable()->after('agent_notes'); // JSON column for multiple IDs
            $table->text('technician_notes')->nullable()->after('technician_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('charge_order', function (Blueprint $table) {
            $table->dropColumn(['agent_notes', 'technician_id', 'technician_notes']);
        });
    }
};
