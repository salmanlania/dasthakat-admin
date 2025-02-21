<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('picklist', function (Blueprint $table) {
            $table->char('picklist_id', 36)->primary();
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->integer('document_type_id');
            $table->integer('document_no');
            $table->string('document_prefix', 50)->nullable();
            $table->string('document_identity', 100)->nullable();
            $table->dateTime('document_date')->nullable();
            $table->char('charge_order_id', 36)->nullable();
            $table->decimal('total_quantity', 10, 2)->default(0.00);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('picklist');
    }
};
