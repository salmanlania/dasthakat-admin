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
        Schema::create('vp_quotation_rfq_detail', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('detail_id', 36)->primary();
            $table->char('id', 36); // FK to vp_quotation_rfq
            $table->integer('sort_order')->default(0);
            $table->char('quotation_detail_id', 36);
            $table->char('vendor_quotation_detail_id', 36)->nullable();
            $table->char('product_id', 36)->nullable();
            $table->char('product_type_id', 36)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->string('product_name')->nullable();
            $table->text('product_description')->nullable();
            $table->decimal('quantity', 15, 2)->default(0.00);
            $table->decimal('vendor_rate', 15, 2)->default(0.00);
            $table->string('vendor_part_no')->nullable();
            $table->text('vendor_notes')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('id');
            $table->index('quotation_detail_id');
            $table->index('product_id');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vp_quotation_rfq_detail');
    }
};
