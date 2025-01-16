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
            $table->char('charge_order_detail_id', 36)->primary();
            $table->char('charge_order_id', 36)->nullable();
            $table->integer('sort_order')->nullable();
            $table->string('product_code', 255)->nullable();
            $table->char('product_id', 36)->nullable();
            $table->string('product_name', 255)->nullable();
            $table->string('product_type', 255)->nullable();
            $table->text('description')->nullable();
            $table->decimal('quantity', 10, 2);
            $table->char('unit_id', 36)->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->timestamps(0);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
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
