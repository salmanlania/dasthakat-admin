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
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('event_dispatch_id', 36)->primary();
            $table->char('event_id', 36);
            $table->char('port_id', 36)->nullable();
            $table->char('agent_id', 36)->nullable();
            $table->json('technician_id')->nullable(); // Changed TEXT to JSON for better structure
            $table->text('technician_notes')->nullable();
            $table->date('event_date')->nullable();
            $table->time('event_time')->nullable();
            $table->text('agent_notes')->nullable();
            $table->string('status')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('event_id');
            $table->index('port_id');
            $table->index('agent_id');
            $table->index('event_date');
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
