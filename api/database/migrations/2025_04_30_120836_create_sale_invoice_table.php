<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('sale_invoice', function (Blueprint $table) {
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->char('sale_invoice_id', 36)->primary();
            $table->char('document_type_id', 36)->nullable();
            $table->integer('document_no')->nullable();
            $table->string('document_prefix', 50)->nullable();
            $table->string('document_identity', 100)->nullable();
            $table->date('document_date')->notNull();
            $table->char('charge_order_id', 36)->nullable();
            $table->decimal('total_quantity', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sale_invoice');
    }
};
