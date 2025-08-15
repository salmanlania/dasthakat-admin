<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('shipment_detail', function (Blueprint $table) {
            $table->char('shipment_detail_id', 36)->primary();
            $table->char('shipment_id', 36);
            $table->integer('sort_order')->default(0);
            $table->char('charge_order_id', 36)->nullable();
            $table->char('charge_order_detail_id', 36)->nullable();
            $table->char('product_id', 36);
            $table->timestamp('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shipment_detail');
    }
};
