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
        Schema::create('product_cart', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('product_id', 40)->nullable();
            $table->char('variant_id', 40)->nullable();
            $table->decimal('quantity', 10, 0)->default(0);
            $table->decimal('price', 10, 0)->default(0);
            $table->decimal('amount', 10, 0)->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->char('created_by', 40)->nullable();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->char('updated_by', 40)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_cart');
    }
};
