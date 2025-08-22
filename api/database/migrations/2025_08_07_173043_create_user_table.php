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
        Schema::create('user', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('permission_id', 36)->nullable();
            $table->char('user_id', 36)->primary();
            $table->string('email')->unique();
            $table->string('user_name', 40)->nullable()->unique();
            $table->char('user_type', 36)->nullable();
            $table->string('password', 255); // Increased length for modern hashing
            $table->string('phone_no')->nullable();
            $table->string('image')->nullable();
            $table->boolean('status')->default(true);
            $table->text('api_token')->nullable();
            $table->time('from_time')->nullable();
            $table->time('to_time')->nullable();
            $table->boolean('super_admin')->default(false);
            $table->boolean('is_exempted')->default(false);
            $table->string('otp')->nullable();
            $table->dateTime('otp_created_at')->nullable(); // Made nullable, more practical
            $table->dateTime('last_login')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('company_id');
            $table->index('permission_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user');
    }
};
