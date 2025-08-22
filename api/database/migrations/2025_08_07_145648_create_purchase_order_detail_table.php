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
        Schema::create('purchase_order_detail', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('purchase_order_id', 36);
            $table->char('purchase_order_detail_id', 36)->primary();
            $table->integer('sort_order');
            $table->char('charge_order_detail_id', 36)->nullable();
            $table->char('product_id', 36);
            $table->integer('product_type_id')->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->string('product_name')->nullable();
            $table->text('product_description')->nullable();
            $table->string('vpart')->nullable();
            $table->text('description')->nullable();
            $table->decimal('quantity', 15, 2)->nullable();
            $table->decimal('rate', 15, 2)->nullable();
            $table->decimal('amount', 15, 2)->nullable();
            $table->text('vendor_notes')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('purchase_order_id');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchase_order_detail');
    }
};
