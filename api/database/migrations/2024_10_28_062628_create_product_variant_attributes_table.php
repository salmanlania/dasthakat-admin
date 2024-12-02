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
        Schema::create('product_variant_attributes', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('product_id', 40)->nullable();
            $table->char('variant_id', 40)->nullable();
            $table->integer('attribute_id')->nullable();
            $table->string('attribute_name', 255)->nullable();
            $table->string('attribute_value', 255)->nullable();
            $table->timestamps(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_variant_attributes');
    }
};
