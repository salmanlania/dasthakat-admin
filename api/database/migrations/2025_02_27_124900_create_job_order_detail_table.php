<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('job_order_detail', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('job_order_id', 36);
            $table->char('job_order_detail_id', 36)->primary();
            $table->char('charge_order_id', 36)->nullable();
            $table->char('charge_order_detail_id', 36)->nullable();
            $table->integer('sort_order')->nullable();
            $table->char('product_id', 36)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->integer('product_type_id')->nullable();
            $table->decimal('quantity', 10, 2)->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('job_order_detail');
    }
};
