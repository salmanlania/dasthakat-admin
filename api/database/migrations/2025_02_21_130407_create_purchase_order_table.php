<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('purchase_order', function (Blueprint $table) {
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->char('purchase_order_id', 36)->primary();
            $table->char('document_type_id', 36)->nullable();
            $table->integer('document_no');
            $table->string('document_prefix')->nullable();
            $table->string('document_identity')->nullable();
            $table->date('document_date')->nullable();
            $table->date('required_date')->nullable();
            $table->char('buyer_id', 36)->nullable();
            $table->string('ship_to')->nullable();
            $table->string('ship_via')->nullable();
            $table->string('department')->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->string('type', 50)->nullable();
            $table->char('quotation_id', 36)->nullable();
            $table->char('charge_order_id', 36)->nullable();
            $table->char('payment_id', 36)->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('total_quantity', 10, 2)->nullable();
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('purchase_order');
    }
};
