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
        Schema::create('vendor_quotation_detail', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('vendor_quotation_detail_id', 36)->primary();
            $table->integer('sort_order');
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('quotation_id', 36);
            $table->char('quotation_detail_id', 36);
            $table->char('vendor_id', 36);
            $table->decimal('vendor_rate', 15, 2)->default(0.00);
            $table->boolean('is_primary_vendor')->default(false);
            $table->string('vendor_part_no')->nullable();
            $table->text('vendor_notes')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('quotation_detail_id');
            $table->index('vendor_id');
            $table->index('is_primary_vendor');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vendor_quotation_detail');
    }
};
