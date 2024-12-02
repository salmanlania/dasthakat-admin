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
        Schema::create('notifications', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('request_id', 40)->nullable();
            $table->char('heading_text', 40)->nullable();
            $table->char('user_id', 40)->nullable();
            $table->string('message', 255)->nullable();
            $table->tinyInteger('is_read')->default(0);
            $table->tinyInteger('is_deleted')->default(0);
            $table->char('created_by', 40)->nullable();
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
        Schema::dropIfExists('notifications');
    }
};
