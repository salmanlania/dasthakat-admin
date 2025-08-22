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
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->integer('document_type_id');
            $table->char('document_id', 36);
            $table->string('document_identity')->nullable();
            $table->date('document_date')->nullable();
            $table->char('warehouse_id', 36);
            $table->char('document_detail_id', 36);
            $table->char('product_id', 36)->nullable();
            $table->char('document_unit_id', 36);
            $table->decimal('document_qty', 15, 2)->default(0.00);
            $table->decimal('unit_conversion', 15, 2)->default(0.00);
            $table->char('base_unit_id', 36)->nullable();
            $table->decimal('base_qty', 15, 2)->default(0.00);
            $table->char('document_currency_id', 36)->nullable();
            $table->decimal('document_rate', 15, 2)->default(0.00);
            $table->decimal('document_amount', 15, 2)->default(0.00);
            $table->decimal('currency_conversion', 15, 2)->default(0.00);
            $table->char('base_currency_id', 36)->nullable();
            $table->decimal('base_rate', 15, 2)->default(0.00);
            $table->decimal('base_amount', 15, 2)->default(0.00);
            $table->text('remarks')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->string('unit')->nullable();
            $table->integer('sort_order')->nullable();

            // Composite Primary Key
            $table->primary(['company_id', 'company_branch_id', 'document_type_id', 'document_id', 'document_detail_id', 'warehouse_id'], 'core_stock_ledger_pk');

            // Additional Indexes for performance
            $table->index('product_id');
            $table->index('document_date');
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
        Schema::dropIfExists('core_stock_ledger');
    }
};
