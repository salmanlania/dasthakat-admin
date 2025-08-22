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
        Schema::create('product', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('product_id', 36)->primary();
            $table->integer('product_type_id')->nullable();
            $table->char('category_id', 36)->nullable();
            $table->char('sub_category_id', 36)->nullable();
            $table->char('brand_id', 36)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->integer('product_no')->nullable();
            $table->string('product_code')->unique();
            $table->char('short_code', 36)->nullable();
            $table->string('image')->nullable();
            $table->string('name');
            $table->string('impa_code')->nullable();
            $table->decimal('cost_price', 15, 2)->default(0.00);
            $table->decimal('sale_price', 15, 2)->default(0.00);
            $table->boolean('status')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['company_id', 'company_branch_id']);
            $table->index('product_type_id');
            $table->index('category_id');
            $table->index('brand_id');
            $table->index('name');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product');
    }
};
