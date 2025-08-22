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
        Schema::create('quotation_detail', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('quotation_id', 36);
            $table->char('quotation_detail_id', 36)->primary();
            $table->integer('sort_order');
            $table->string('product_code')->nullable();
            $table->char('product_id', 36)->nullable();
            $table->char('product_type_id', 36)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->string('product_name')->nullable();
            $table->text('product_description')->nullable();
            $table->text('description')->nullable();
            $table->string('vendor_part_no')->nullable();
            $table->text('vendor_notes')->nullable();
            $table->text('internal_notes')->nullable();
            $table->decimal('quantity', 15, 2)->default(0.00);
            $table->decimal('cost_price', 15, 2)->default(0.00);
            $table->decimal('markup', 15, 2)->default(0.00);
            $table->decimal('rate', 15, 2)->default(0.00);
            $table->decimal('amount', 15, 2)->default(0.00);
            $table->decimal('discount_amount', 15, 2)->default(0.00);
            $table->decimal('discount_percent', 15, 2)->nullable();
            $table->decimal('gross_amount', 15, 2)->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('quotation_id');
            $table->index('product_id');
            $table->index('supplier_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quotation_detail');
    }
};
