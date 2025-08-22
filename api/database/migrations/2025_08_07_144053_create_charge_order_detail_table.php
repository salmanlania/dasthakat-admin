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
        Schema::create('charge_order_detail', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('charge_order_detail_id', 36)->primary();
            $table->char('charge_order_id', 36)->nullable();
            $table->integer('sort_order')->nullable();
            $table->string('product_code')->nullable();
            $table->char('product_id', 36)->nullable();
            $table->char('product_type_id', 36)->nullable();
            $table->char('warehouse_id', 36)->nullable();
            $table->char('quotation_detail_id', 36)->nullable();
            $table->char('purchase_order_id', 36)->nullable();
            $table->char('purchase_order_detail_id', 36)->nullable();
            $table->char('service_order_id', 36)->nullable();
            $table->char('service_order_detail_id', 36)->nullable();
            $table->char('servicelist_id', 36)->nullable();
            $table->char('servicelist_detail_id', 36)->nullable();
            $table->char('picklist_id', 36)->nullable();
            $table->char('picklist_detail_id', 36)->nullable();
            $table->char('job_order_id', 36)->nullable();
            $table->char('job_order_detail_id', 36)->nullable();
            $table->char('shipment_id', 36)->nullable();
            $table->char('shipment_detail_id', 36)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->string('product_name')->nullable();
            $table->text('product_description')->nullable();
            $table->text('description')->nullable();
            $table->string('vendor_part_no')->nullable();
            $table->text('internal_notes')->nullable();
            $table->decimal('quantity', 15, 2)->default(0.00);
            $table->decimal('cost_price', 15, 2)->default(0.00);
            $table->decimal('markup', 15, 2)->default(0.00);
            $table->decimal('rate', 15, 2)->default(0.00);
            $table->decimal('amount', 15, 2)->default(0.00);
            $table->decimal('discount_amount', 15, 2)->default(0.00);
            $table->decimal('discount_percent', 15, 2)->default(0.00);
            $table->decimal('gross_amount', 15, 2)->default(0.00);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Foreign key and other important indexes
            $table->index('charge_order_id');
            $table->index('product_id');
            $table->index('product_code');
            $table->index('servicelist_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('charge_order_detail');
    }
};
