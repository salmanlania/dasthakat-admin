<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vp_quotation_rfq', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('quotation_id', 36);
            $table->char('vendor_id', 36)->nullable();
            $table->char('status', 50)->nullable();
            $table->integer('total_items')->nullable();
            $table->integer('items_quoted')->nullable();
            $table->datetime('date_required')->nullable();
            $table->datetime('date_sent')->nullable();
            $table->datetime('date_returned')->nullable();
            $table->timestamps();
            
            // Add indexes for better query performance
            $table->index('quotation_id');
            $table->index('vendor_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vp_quotation_rfq');
    }
};