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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('product_id', 40)->nullable();
            $table->string('part_number', 255)->nullable();
            $table->decimal('corresponding_price', 10, 0)->default(0);
            $table->string('corresponding_size', 255)->nullable();
            $table->string('voltage', 255)->nullable();
            $table->string('bend', 255)->nullable();
            $table->string('type', 255)->nullable();
            $table->string('stroke', 255)->nullable();
            $table->tinyInteger('sort_order')->default(0);
            $table->dateTime('created_at')->default(DB::raw('current_timestamp()'));
            $table->char('created_by', 40);
            $table->dateTime('updated_at')->nullable()->default(DB::raw('current_timestamp() ON UPDATE current_timestamp()'));
            $table->char('updated_by', 40);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_variants');
    }
};
