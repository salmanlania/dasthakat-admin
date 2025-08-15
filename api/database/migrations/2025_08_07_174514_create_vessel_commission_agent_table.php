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
        Schema::create('vessel_commission_agent', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('vessel_commission_agent_id', 36)->primary();
            $table->integer('sort_order')->nullable();
            $table->char('commission_agent_id', 36);
            $table->char('vessel_id', 36);
            $table->string('type');
            $table->decimal('commission_percentage', 15, 2);
            $table->string('status')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('commission_agent_id');
            $table->index('vessel_id');
            $table->unique(['vessel_id', 'commission_agent_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vessel_commission_agent');
    }
};
