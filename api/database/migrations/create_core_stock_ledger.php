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
        Schema::create('core_stock_ledger', function (Blueprint $table) {
            $table->integer('company_id');
            $table->integer('company_branch_id');
            $table->integer('fiscal_year_id');
            $table->integer('document_type_id');
            $table->char('document_id', 36);
            $table->string('document_identity', 255)->nullable();
            $table->date('document_date')->nullable();
            $table->integer('warehouse_id');
            $table->char('document_detail_id', 36);
            $table->char('product_id', 36)->nullable();
            $table->integer('document_unit_id')->nullable();
            $table->decimal('document_qty', 10, 2)->default(0.00);
            $table->decimal('unit_conversion', 10, 2)->default(0.00);
            $table->integer('base_unit_id')->nullable();
            $table->decimal('base_qty', 10, 2)->default(0.00);
            $table->integer('document_currency_id')->nullable();
            $table->decimal('document_rate', 10, 2)->default(0.00);
            $table->decimal('document_amount', 10, 2)->default(0.00);
            $table->decimal('currency_conversion', 10, 2)->default(0.00);
            $table->integer('base_currency_id')->nullable();
            $table->decimal('base_rate', 10, 2)->default(0.00);
            $table->decimal('base_amount', 10, 2)->default(0.00);
            $table->text('remarks')->nullable();
            $table->timestamps(0);
            $table->integer('created_by_id')->nullable();
            $table->string('unit', 255)->nullable();
            $table->integer('sort_order')->nullable();
          
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('core_stock_ledger');
    }
};
