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
        Schema::create('quotation_commission_agent', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('id', 36)->primary();
            $table->integer('sort_order')->default(0);
            $table->char('quotation_id', 36);
            $table->char('commission_agent_id', 36);
            $table->char('customer_id', 36);
            $table->char('vessel_id', 36);
            $table->decimal('percentage', 15, 2);
            $table->decimal('amount', 15, 2)->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('quotation_id');
            $table->index('commission_agent_id');
            $table->unique('quotation_id');
            $table->unique('commission_agent_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quotation_commission_agent');
    }
};
