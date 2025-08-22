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
        Schema::create('quotation', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('quotation_id', 36)->primary();
            $table->integer('document_type_id')->nullable();
            $table->string('document_prefix')->nullable();
            $table->integer('document_no');
            $table->string('document_identity')->nullable()->unique();
            $table->date('document_date');
            $table->char('salesman_id', 36)->nullable();
            $table->char('event_id', 36)->nullable();
            $table->char('vessel_id', 36)->nullable();
            $table->char('customer_id', 36)->nullable();
            $table->char('person_incharge_id', 36)->nullable();
            $table->char('flag_id', 36)->nullable();
            $table->char('class1_id', 36)->nullable();
            $table->char('class2_id', 36)->nullable();
            $table->char('validity_id', 36)->nullable();
            $table->char('payment_id', 36)->nullable();
            $table->char('port_id', 36)->nullable();
            $table->json('term_id')->nullable(); // Using JSON for better structure than TEXT
            $table->string('customer_ref')->nullable();
            $table->date('service_date')->nullable();
            $table->date('due_date')->nullable();
            $table->string('attn')->nullable();
            $table->string('delivery')->nullable();
            $table->text('internal_notes')->nullable();
            $table->text('term_desc')->nullable();
            $table->string('remarks')->nullable();
            $table->decimal('total_cost', 15, 2)->default(0.00);
            $table->decimal('total_quantity', 15, 2)->default(0.00);
            $table->decimal('total_amount', 15, 2)->default(0.00);
            $table->decimal('total_discount', 15, 2)->default(0.00);
            $table->decimal('net_amount', 15, 2)->default(0.00);
            $table->boolean('is_approved')->default(false);
            $table->decimal('rebate_percent', 15, 2)->nullable();
            $table->decimal('rebate_amount', 15, 2)->nullable();
            $table->decimal('salesman_percent', 15, 2)->nullable();
            $table->decimal('salesman_amount', 15, 2)->nullable();
            $table->decimal('final_amount', 15, 2)->nullable();
            $table->string('status')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes for all foreign keys and common search criteria
            $table->index(['company_id', 'company_branch_id']);
            $table->index('document_date');
            $table->index('salesman_id');
            $table->index('event_id');
            $table->index('vessel_id');
            $table->index('customer_id');
            $table->index('status');
            $table->index('is_approved');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quotation');
    }
};
