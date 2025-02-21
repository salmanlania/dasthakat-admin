<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('charge_order', function (Blueprint $table) {
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->char('charge_order_id', 36)->primary();
            $table->integer('document_type_id')->nullable();
            $table->string('document_prefix', 255)->nullable();
            $table->integer('document_no');
            $table->string('document_identity', 255)->nullable();
            $table->integer('ref_document_type_id')->nullable();
            $table->string('ref_document_identity', 255)->nullable();
            $table->date('document_date');
            $table->char('salesman_id', 36)->nullable();
            $table->char('customer_id', 36)->nullable();
            $table->string('customer_po_no', 255)->nullable();
            $table->char('event_id', 36)->nullable();
            $table->char('vessel_id', 36)->nullable();
            $table->char('flag_id', 36)->nullable();
            $table->char('class1_id', 36)->nullable();
            $table->char('class2_id', 36)->nullable();
            $table->char('agent_id', 36)->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('total_quantity', 10, 2)->nullable();
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->decimal('net_amount', 10, 2)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('charge_order');
    }
};
