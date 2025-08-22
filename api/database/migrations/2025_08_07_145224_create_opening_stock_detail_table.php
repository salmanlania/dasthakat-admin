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
        Schema::create('opening_stock_detail', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            
            $table->char('opening_stock_detail_id', 36)->primary();
            $table->char('opening_stock_id', 36);
            $table->integer('sort_order')->default(0);
            $table->char('product_type_id', 36);
            $table->char('product_id', 36);
            $table->char('unit_id', 36);
            $table->char('warehouse_id', 36);
            $table->integer('document_currency_id');
            $table->integer('base_currency_id');
            $table->string('product_name');
            $table->text('product_description')->nullable();
            $table->text('description')->nullable();
            $table->decimal('unit_conversion', 15, 2);
            $table->decimal('currency_conversion', 15, 2);
            $table->decimal('quantity', 15, 2);
            $table->decimal('rate', 15, 2);
            $table->decimal('amount', 15, 2);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('opening_stock_id');
            $table->index('product_id');
            $table->index('warehouse_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('opening_stock_detail');
    }
};
