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
        Schema::create('core_company_branch_document_prefix', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_branch_document_prefix_id', 36)->primary();
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->integer('document_type_id')->nullable();
            $table->string('document_name')->nullable();
            $table->string('document_prefix')->nullable();
            $table->tinyInteger('zero_padding')->nullable();
            $table->enum('reset_on_fiscal_year', ['Yes', 'No', 'Manual'])->nullable();
            $table->string('table_name')->nullable();
            $table->string('route')->nullable();
            $table->string('primary_key')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            
            // A branch should only have one prefix setting per document type
            $table->unique(['company_branch_id', 'document_type_id'], 'branch_doc_type_unique');
            $table->index('company_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('core_company_branch_document_prefix');
    }
};
