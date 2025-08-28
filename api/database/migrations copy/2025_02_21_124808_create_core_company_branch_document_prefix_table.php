<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('core_company_branch_document_prefix', function (Blueprint $table) {
            $table->char('company_branch_document_prefix_id', 36)->primary();
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->integer('document_type_id')->nullable();
            $table->string('document_name', 255)->nullable();
            $table->string('document_prefix', 255)->nullable();
            $table->tinyInteger('zero_padding')->nullable();
            $table->enum('reset_on_fiscal_year', ['Yes', 'No', 'Manual'])->nullable();
            $table->string('table_name', 32)->nullable();
            $table->string('route', 255)->nullable();
            $table->string('primary_key', 255)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('core_company_branch_document_prefix');
    }
};
