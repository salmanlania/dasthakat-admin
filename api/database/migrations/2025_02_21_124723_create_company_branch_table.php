<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('company_branch', function (Blueprint $table) {
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->primary();
            $table->char('branch_code', 36)->nullable();
            $table->string('name', 255)->nullable();
            $table->text('address')->nullable();
            $table->string('phone_no', 255)->nullable();
            $table->string('image', 255)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('company_branch');
    }
};
