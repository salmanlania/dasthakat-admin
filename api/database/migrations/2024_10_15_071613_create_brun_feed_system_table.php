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
        Schema::create('brun_feed_system', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('request_id', 40)->nullable();
            $table->integer('feed_stations')->nullable();
            $table->char('feed_type', 40)->nullable();
            $table->tinyInteger('anti_bully_bars')->default(0);
            $table->integer('sort_order')->default(0);
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
        Schema::dropIfExists('brun_feed_system');
    }
};
