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
        Schema::create('shipment_detail', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('shipment_detail_id', 36)->primary();
            $table->char('shipment_id', 36);
            $table->integer('sort_order')->default(0);
            $table->char('charge_order_id', 36)->nullable();
            $table->char('charge_order_detail_id', 36)->nullable();
            $table->char('product_id', 36);
            $table->char('product_type_id', 36)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->string('product_name')->nullable();
            $table->text('product_description')->nullable();
            $table->text('description')->nullable();
            $table->text('internal_notes')->nullable();
            $table->decimal('quantity', 15, 2)->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('shipment_id');
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
        Schema::dropIfExists('shipment_detail');
    }
};
