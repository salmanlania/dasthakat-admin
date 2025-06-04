<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_return', function (Blueprint $table) {
            $table->char('stock_return_id', 36)->primary();
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->unsignedInteger('document_type_id')->nullable();
            $table->unsignedInteger('document_no')->nullable();
            $table->string('document_prefix')->nullable();
            $table->string('document_identity')->nullable();
            $table->date('document_date')->nullable();
            $table->string('ship_to')->nullable();
            $table->string('ship_via')->nullable();
            $table->dateTime('return_date')->nullable();
            $table->char('charge_order_id', 36)->nullable();
            $table->char('picklist_id', 36)->nullable();
            $table->decimal('total_quantity', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->string('status')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_return');
    }
};
