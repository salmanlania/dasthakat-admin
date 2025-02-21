<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('purchase_order_detail', function (Blueprint $table) {
            $table->char('purchase_order_id', 36)->nullable();
            $table->char('purchase_order_detail_id', 36)->primary();
            $table->integer('sort_order');
            $table->char('product_id', 36)->nullable();
            $table->string('product_name')->nullable();
            $table->integer('product_type_id')->nullable();
            $table->text('description')->nullable();
            $table->string('vpart')->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->decimal('quantity', 10, 2)->nullable();
            $table->decimal('rate', 10, 2)->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->text('vendor_notes')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('purchase_order_detail');
    }
};
