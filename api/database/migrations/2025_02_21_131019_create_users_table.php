<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('user', function (Blueprint $table) {
            $table->char('company_id', 36)->nullable();
            $table->char('permission_id', 36)->nullable();
            $table->char('user_id', 36)->primary();
            $table->string('email', 255)->nullable();
            $table->char('password', 40)->nullable();
            $table->char('user_name', 40)->nullable();
            $table->string('image', 255)->nullable();
            $table->tinyInteger('status')->default(1);
            $table->boolean('super_admin')->default(false);
            $table->text('api_token')->nullable();
            $table->time('from_time')->nullable();
            $table->time('to_time')->nullable();
            $table->dateTime('last_login')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('user');
    }
};
