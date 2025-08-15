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
        Schema::create('vp_quotation_rfq', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('id', 36)->primary();
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->integer('document_type_id');
            $table->integer('document_no');
            $table->string('document_prefix');
            $table->string('document_identity')->unique();
            $table->char('quotation_id', 36);
            $table->char('vendor_id', 36)->nullable();
            $table->dateTime('date_sent')->nullable();
            $table->date('date_required')->nullable();
            $table->dateTime('date_returned')->nullable();
            $table->string('vendor_ref_no')->nullable();
            $table->string('vendor_remarks')->nullable();
            $table->integer('notification_count')->default(0);
            $table->boolean('is_cancelled')->default(false);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['company_id', 'company_branch_id']);
            $table->index('quotation_id');
            $table->index('vendor_id');
            $table->index('is_cancelled');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vp_quotation_rfq');
    }
};
