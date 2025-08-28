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
        Schema::create('service_order_detail', function (Blueprint $table) {
            $table->char('service_order_detail_id', 36)->primary();
            $table->char('service_order_id', 36);
            $table->integer('sort_order')->default(0);
            $table->char('charge_order_id', 36)->nullable();
            $table->char('charge_order_detail_id', 36)->nullable();
            $table->char('product_id', 36)->nullable();
            $table->char('product_type_id', 36)->nullable();
            $table->string('product_name')->nullable();
            $table->text('product_description')->nullable();
            $table->text('description')->nullable();
            $table->text('internal_notes')->nullable();
            $table->decimal('quantity', 12, 2)->default(0);
            $table->char('unit_id', 36)->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('service_order_detail');
    }
};
