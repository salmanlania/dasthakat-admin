<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('core_stock_ledger', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->integer('document_type_id');
            $table->char('document_id', 36);
            $table->string('document_identity', 255)->nullable();
            $table->date('document_date')->nullable();
            $table->char('warehouse_id', 36);
            $table->char('document_detail_id', 36);
            $table->char('product_id', 36)->nullable();
            $table->char('document_unit_id', 36);
            $table->decimal('document_qty', 10, 2)->default(0.00);
            $table->decimal('unit_conversion', 10, 2)->default(0.00);
            $table->char('base_unit_id', 36)->nullable();
            $table->decimal('base_qty', 10, 2)->default(0.00);
            $table->char('document_currency_id', 36)->nullable();
            $table->decimal('document_rate', 10, 2)->default(0.00);
            $table->decimal('document_amount', 10, 2)->default(0.00);
            $table->decimal('currency_conversion', 10, 2)->default(0.00);
            $table->char('base_currency_id', 36)->nullable();
            $table->decimal('base_rate', 10, 2)->default(0.00);
            $table->decimal('base_amount', 10, 2)->default(0.00);
            $table->text('remarks')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->string('unit', 255)->nullable();
            $table->integer('sort_order')->nullable();

            $table->primary(['company_id', 'company_branch_id', 'document_type_id', 'document_id', 'document_detail_id', 'warehouse_id']);
        });
    }

    public function down() {
        Schema::dropIfExists('core_stock_ledger');
    }
};
