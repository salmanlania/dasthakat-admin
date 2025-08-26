<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quotation_vendor_rate_history', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->string('vp_quotation_rfq_id', 36)->nullable()->index();
            $table->string('vp_quotation_rfq_detail_id', 36)->nullable()->index();
            $table->string('quotation_id', 36)->nullable()->index();
            $table->string('quotation_detail_id', 36)->nullable()->index();
            $table->string('product_id')->nullable()->index();
            $table->string('product_name')->nullable()->index();
            $table->text('product_description')->nullable();
            $table->string('vendor_id', 36)->nullable()->index();
            $table->decimal('vendor_rate', 18, 6)->nullable();
            $table->date('validity_date')->nullable()->index();
            $table->string('created_by', 36)->nullable();
            $table->string('updated_by', 36)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotation_vendor_rate_history');
    }
};
