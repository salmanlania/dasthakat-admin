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
        Schema::create('purchase_order', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('purchase_order_id', 36)->primary();
            $table->integer('document_type_id');
            $table->integer('document_no');
            $table->string('document_prefix');
            $table->string('document_identity')->nullable()->unique();
            $table->date('document_date')->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->char('quotation_id', 36)->nullable();
            $table->char('charge_order_id', 36)->nullable();
            $table->char('payment_id', 36)->nullable();
            $table->char('buyer_id', 36)->nullable();
            $table->string('type')->nullable();
            $table->date('required_date')->nullable();
            $table->string('ship_to')->nullable();
            $table->string('ship_via')->nullable();
            $table->string('department')->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('total_quantity', 15, 2)->default(0.00);
            $table->decimal('total_amount', 15, 2)->default(0.00);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['company_id', 'company_branch_id']);
            $table->index('document_date');
            $table->index('supplier_id');
            $table->index('charge_order_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchase_order');
    }
};
