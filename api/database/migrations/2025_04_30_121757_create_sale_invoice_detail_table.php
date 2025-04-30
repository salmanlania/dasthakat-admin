<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('sale_invoice_detail', function (Blueprint $table) {
            $table->char('sale_invoice_detail_id', 36)->primary();
            $table->char('charge_order_detail_id', 36)->nullable();
            $table->char('sale_invoice_id', 36)->nullable();
            $table->integer('sort_order')->default(0);
            $table->char('product_id', 36)->nullable();
            $table->string('product_name', 255)->nullable();
            $table->string('product_description', 255)->nullable();
            $table->text('description')->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->decimal('quantity', 10, 2)->default(0.00);
            $table->decimal('rate', 15, 2)->default(0.00);
            $table->decimal('amount', 15, 2)->default(0.00);
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sale_invoice_detail');
    }
};
