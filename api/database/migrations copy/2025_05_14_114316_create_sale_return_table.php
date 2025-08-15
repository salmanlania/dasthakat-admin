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
        Schema::create('sale_return', function (Blueprint $table) {
            $table->char('sale_return_id', 36)->primary();
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->integer('document_type_id');
            $table->integer('document_no');
            $table->string('document_prefix', 255);
            $table->string('document_identity', 255);
            $table->date('document_date');
            $table->char('charge_order_id', 36)->nullable();
            $table->char('picklist_id', 36)->nullable();
            $table->decimal('total_quantity', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps(0);

           });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_return');
    }
};
