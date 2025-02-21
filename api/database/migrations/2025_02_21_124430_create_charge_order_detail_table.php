<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('charge_order_detail', function (Blueprint $table) {
            $table->char('charge_order_detail_id', 36)->primary();
            $table->char('charge_order_id', 36)->nullable();
            $table->integer('sort_order')->nullable();
            $table->string('product_code', 255)->nullable();
            $table->char('product_id', 36)->nullable();
            $table->string('product_name', 255)->nullable();
            $table->char('product_type_id', 36)->nullable();
            $table->text('description')->nullable();
            $table->char('warehouse_id', 36)->nullable();
            $table->char('purchase_order_id', 36)->nullable();
            $table->char('purchase_order_detail_id', 36)->nullable();
            $table->char('picklist_id', 36)->nullable();
            $table->char('picklist_detail_id', 36)->nullable();
            $table->decimal('quantity', 10, 2);
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->decimal('rate', 10, 2)->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->decimal('discount_percent', 10, 2)->nullable();
            $table->decimal('gross_amount', 10, 2)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('charge_order_detail');
    }
};
