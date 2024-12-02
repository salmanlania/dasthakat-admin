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
        Schema::create('product_images', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('product_id', 40)->nullable();
            $table->string('image', 255);
            $table->string('path', 255)->nullable();
            $table->tinyInteger('sort_order')->default(0);
            $table->dateTime('created_at')->default(DB::raw('current_timestamp()'));
            $table->dateTime('updated_at')->nullable()->default(DB::raw('current_timestamp() ON UPDATE current_timestamp()'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_images');
    }
};
