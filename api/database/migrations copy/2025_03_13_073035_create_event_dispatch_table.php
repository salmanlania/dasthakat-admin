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
        Schema::create('event_dispatch', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('event_dispatch_id', 36)->primary();
            $table->date('event_date');
            $table->char('event_id', 36);
            $table->char('technician_id', 36);
            $table->text('technician_notes');
            $table->char('agent_id', 36);
            $table->text('agent_notes');
            $table->char('created_by', 36);
            $table->char('updated_by', 36);
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('event_dispatch');
    }
};
