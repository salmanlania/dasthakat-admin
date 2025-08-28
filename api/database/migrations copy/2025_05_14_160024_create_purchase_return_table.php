<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('purchase_return', function (Blueprint $table) {
            $table->char('purchase_return_id', 36)->primary();
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->integer('document_type_id');
            $table->string('document_no');
            $table->string('document_prefix');
            $table->string('document_identity');
            $table->date('document_date');
            $table->char('charge_order_id', 36)->nullable();
            $table->char('purchase_order_id', 36)->nullable();
            $table->decimal('total_quantity', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('purchase_return');
    }
};
