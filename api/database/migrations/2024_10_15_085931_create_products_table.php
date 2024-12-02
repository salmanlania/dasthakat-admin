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
        Schema::create('products', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('product_category_id', 40)->nullable();
            $table->string('name', 255)->nullable();
            $table->string('label_tags', 255)->nullable();
            $table->text('summary')->nullable();
            $table->text('description')->nullable();
            $table->date('schedule_date')->nullable();
            $table->string('schedule_time', 255)->nullable();
            $table->tinyInteger('is_published')->default(0);
            $table->tinyInteger('status')->default(1);
            $table->tinyInteger('is_deleted')->default(0);
            $table->dateTime('created_at')->default(DB::raw('current_timestamp()'));
            $table->char('created_by', 40)->nullable();
            $table->dateTime('updated_at')->default(DB::raw('current_timestamp() ON UPDATE current_timestamp()'));
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
        Schema::dropIfExists('products');
    }
};
