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
        Schema::create('good_received_note_detail', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('good_received_note_id', 36);
            $table->char('good_received_note_detail_id', 36)->primary();
            $table->integer('sort_order');
            $table->char('charge_order_detail_id', 36)->nullable();
            $table->char('purchase_order_detail_id', 36)->nullable();
            $table->char('product_id', 36);
            $table->integer('product_type_id')->nullable();
            $table->char('warehouse_id', 36)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->integer('document_currency_id')->nullable();
            $table->integer('base_currency_id')->nullable();
            $table->string('product_name')->nullable();
            $table->text('product_description')->nullable();
            $table->decimal('unit_conversion', 15, 2)->nullable();
            $table->decimal('currency_conversion', 15, 2)->nullable();
            $table->text('vendor_notes')->nullable();
            $table->text('description')->nullable();
            $table->decimal('quantity', 15, 2)->nullable();
            $table->decimal('rate', 15, 2)->nullable();
            $table->decimal('amount', 15, 2)->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes for joining and filtering
            $table->index('good_received_note_id');
            $table->index('product_id');
            $table->index('purchase_order_detail_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('good_received_note_detail');
    }
};
