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
        Schema::create('sale_return_detail', function (Blueprint $table) {
            $table->char('sale_return_detail_id', 36)->primary();
            $table->char('sale_return_id', 36);
            $table->char('charge_order_detail_id', 36)->nullable();
            $table->char('picklist_detail_id', 36)->nullable();
            $table->integer('sort_order');
            $table->char('product_id', 36);
            $table->string('product_name', 255);
            $table->text('product_description')->nullable();
            $table->text('description')->nullable();
            $table->char('warehouse_id', 36);
            $table->char('unit_id', 36);
            $table->decimal('quantity', 10, 2);
            $table->decimal('rate', 10, 2);
            $table->decimal('amount', 10, 2);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_return_detail');
    }
};
