<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('quotation', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('quotation_id', 36)->primary();
            $table->integer('document_type_id')->nullable();
            $table->string('document_prefix')->nullable();
            $table->integer('document_no');
            $table->string('document_identity')->nullable();
            $table->date('document_date');
            $table->char('salesman_id', 36)->nullable();
            $table->char('event_id', 36)->nullable();
            $table->char('vessel_id', 36)->nullable();
            $table->char('customer_id', 36)->nullable();
            $table->char('person_incharge_id', 36)->nullable();
            $table->char('flag_id', 36)->nullable();
            $table->char('class1_id', 36)->nullable();
            $table->char('class2_id', 36)->nullable();
            $table->string('customer_ref')->nullable();
            $table->date('service_date')->nullable();
            $table->date('due_date')->nullable();
            $table->string('attn')->nullable();
            $table->string('delivery')->nullable();
            $table->char('validity_id', 36)->nullable();
            $table->char('payment_id', 36)->nullable();
            $table->text('internal_notes')->nullable();
            $table->char('port_id', 36)->nullable();
            $table->text('term_id')->nullable();
            $table->text('term_desc')->nullable();
            $table->decimal('total_quantity', 10, 2)->nullable();
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->decimal('total_discount', 10, 2)->nullable();
            $table->decimal('net_amount', 10, 2)->nullable();
            $table->string('status')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->decimal('rebate_percent', 10, 2)->nullable();
            $table->decimal('rebate_amount', 10, 2)->nullable();
            $table->decimal('salesman_percent', 10, 2)->nullable();
            $table->decimal('salesman_amount', 10, 2)->nullable();
            $table->decimal('final_amount', 10, 2)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('quotation');
    }
};
