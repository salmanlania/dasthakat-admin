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
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
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
            $table->char('event_id', 36)->nullable();
            $table->char('vessel_id', 36)->nullable();
            $table->char('flag_id', 36)->nullable();
            $table->char('class1_id', 36)->nullable();
            $table->char('class2_id', 36)->nullable();
            $table->char('agent_id', 36)->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('total_quantity', 10, 2)->nullable();
            $table->timestamps(0);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
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
