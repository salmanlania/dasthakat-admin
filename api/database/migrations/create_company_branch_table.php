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
        Schema::create('company_branch', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36)->primary();
            $table->char('branch_code', 36);
            $table->string('name', 255);
            $table->text('address')->nullable();
            $table->string('phone_no', 255)->nullable();
            $table->string('image', 255)->nullable();
            $table->timestamps(0);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('company_branch');
    }
};
