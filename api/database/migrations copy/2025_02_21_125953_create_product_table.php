<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('product', function (Blueprint $table) {
            $table->char('company_id', 36)->notNull();
            $table->char('company_branch_id', 36)->notNull();
            $table->char('product_id', 36)->primary();
            $table->integer('product_no')->nullable();
            $table->string('product_code', 255)->nullable();
            $table->integer('product_type_id')->nullable();
            $table->string('image', 255)->nullable();
            $table->string('name', 255)->nullable();
            $table->string('impa_code', 255)->nullable();
            $table->char('category_id', 36)->nullable();
            $table->char('sub_category_id', 36)->nullable();
            $table->char('brand_id', 36)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->boolean('status')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('product');
    }
};
