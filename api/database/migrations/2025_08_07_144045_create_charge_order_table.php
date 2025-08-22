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
        Schema::create('charge_order', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('charge_order_id', 36)->primary();
            $table->integer('document_type_id')->nullable();
            $table->string('document_prefix')->nullable();
            $table->integer('document_no');
            $table->string('document_identity')->nullable()->unique();
            $table->integer('ref_document_type_id')->nullable();
            $table->string('ref_document_identity')->nullable();
            $table->date('document_date');
            $table->char('salesman_id', 36)->nullable();
            $table->char('customer_id', 36)->nullable();
            $table->char('event_id', 36)->nullable();
            $table->char('vessel_id', 36)->nullable();
            $table->char('flag_id', 36)->nullable();
            $table->char('port_id', 36)->nullable();
            $table->char('class1_id', 36)->nullable();
            $table->char('class2_id', 36)->nullable();
            $table->char('agent_id', 36)->nullable();
            $table->json('technician_id')->nullable();
            $table->string('customer_po_no')->nullable();
            $table->text('agent_notes')->nullable();
            $table->text('technician_notes')->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('total_quantity', 15, 2)->nullable();
            $table->decimal('total_amount', 15, 2)->nullable();
            $table->decimal('discount_amount', 15, 2)->nullable();
            $table->decimal('net_amount', 15, 2)->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes on foreign keys and commonly queried columns
            $table->index('company_id');
            $table->index('company_branch_id');
            $table->index('document_no');
            $table->index('document_date');
            $table->index('customer_id');
            $table->index('salesman_id');
            $table->index('agent_id');
            $table->index('vessel_id');
            $table->index('is_deleted');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('charge_order');
    }
};
