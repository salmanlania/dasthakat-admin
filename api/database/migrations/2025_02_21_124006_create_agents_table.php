<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('agent', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('agent_id', 36)->primary();
            $table->string('name', 255);
            $table->string('agent_code', 255)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 255)->nullable();
            $table->string('state', 255)->nullable();
            $table->string('zip_code', 255)->nullable();
            $table->string('phone', 255)->nullable();
            $table->string('fax', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('agent');
    }
};
