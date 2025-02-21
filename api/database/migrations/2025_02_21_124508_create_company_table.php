<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('company', function (Blueprint $table) {
            $table->char('company_id', 36)->primary();
            $table->string('image', 255)->nullable();
            $table->string('name', 255)->nullable();
            $table->text('address')->nullable();
            $table->char('base_currency_id', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('company');
    }
};
