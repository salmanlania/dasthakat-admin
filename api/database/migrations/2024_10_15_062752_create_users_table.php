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
            $table->char('id', 40)->primary();
            $table->enum('user_type', ['Internal', 'Partner'])->default('Internal');
            $table->char('permission_id', 40)->nullable();
            $table->char('name', 40);
            $table->char('email', 40);
            $table->string('password', 255)->nullable();
            $table->char('phone_no', 40)->nullable();
            $table->integer('country_id')->nullable();
            $table->string('site_url', 255)->nullable();
            $table->string('dealer_id', 255)->nullable();
            $table->string('organization', 255)->nullable();
            $table->integer('postal_code')->nullable();
            $table->string('address', 255)->nullable();
            $table->string('api_token', 255)->nullable();
            $table->tinyInteger('status')->default(0);
            $table->string('image', 255)->nullable();
            $table->tinyInteger('is_deleted')->default(0);
            $table->tinyInteger('is_change_password')->default(0);
            $table->dateTime('last_login')->nullable();
            $table->integer('created_by')->nullable();
            $table->timestamps(0); // This will create `created_at` and `updated_at` columns
            $table->integer('updated_by')->nullable();
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
