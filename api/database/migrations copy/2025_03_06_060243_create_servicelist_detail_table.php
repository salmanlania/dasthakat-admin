<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('servicelist_detail', function (Blueprint $table) {
            $table->char('servicelist_detail_id', 36)->primary();
            $table->char('servicelist_id', 36);
            $table->char('charge_order_detail_id', 36);
            $table->integer('sort_order');
            $table->char('product_id', 36);
            $table->decimal('quantity', 10, 2)->default(0);
            $table->char('created_by', 36);
            $table->char('updated_by', 36);
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('servicelist_detail');
    }
};
