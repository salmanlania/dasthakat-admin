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
        Schema::create('currency', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('currency_id', 36)->primary();
            $table->string('currency_code', 255);
            $table->string('name', 255);
            $table->string('symbol_left', 255)->nullable();
            $table->string('symbol_right', 255)->nullable();
            $table->decimal('value', 10, 2)->default(1.00);
            $table->tinyInteger('status')->default(1);
            $table->timestamps(0);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();

            $table->unique('currency_code');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('currency');
    }
};
