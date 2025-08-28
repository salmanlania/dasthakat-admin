<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('quotation_detail', function (Blueprint $table) {
            $table->char('quotation_id', 36);
            $table->char('quotation_detail_id', 36)->primary();
            $table->integer('sort_order');
            $table->string('product_code', 255)->nullable();
            $table->char('product_id', 36)->nullable();
            $table->string('product_name', 255)->nullable();
            $table->char('product_type_id', 36)->nullable();
            $table->text('description')->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->string('vendor_part_no', 255)->nullable();
            $table->decimal('quantity', 10, 2)->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->decimal('markup', 10, 2)->nullable();
            $table->decimal('rate', 10, 2)->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->decimal('discount_percent', 10, 2)->nullable();
            $table->decimal('gross_amount', 10, 2)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('quotation_detail');
    }
};
