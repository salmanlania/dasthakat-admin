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
        Schema::create('service_order', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('service_order_id', 36)->primary();
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->integer('document_type_id');
            $table->integer('document_no')->nullable();
            $table->string('document_prefix')->nullable();
            $table->string('document_identity')->nullable()->unique();
            $table->date('document_date')->nullable();
            $table->char('event_id', 36)->nullable();
            $table->char('charge_order_id', 36)->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['company_id', 'company_branch_id']);
            $table->index('document_date');
            $table->index('event_id');
            $table->index('charge_order_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_order');
    }
};
