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
        Schema::create('user_permission', function (Blueprint $table) {
            $table->char('user_permission_id', 40)->primary();
            $table->string('name', 64);
            $table->text('description')->nullable();
            $table->text('permission');
            $table->tinyInteger('is_deleted')->default(0);
            $table->char('created_by', 40)->nullable();
            $table->dateTime('created_at')->default(DB::raw('current_timestamp()'));
            $table->char('updated_by', 40)->nullable();
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
        Schema::dropIfExists('user_permission');
    }
};
