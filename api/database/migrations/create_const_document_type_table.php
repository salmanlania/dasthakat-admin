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
        Schema::create('const_document_type', function (Blueprint $table) {
            $table->increments('document_type_id');
            $table->string('document_name', 255);
            $table->string('document_prefix', 255);
            $table->tinyInteger('zero_padding')->default(4);
            $table->enum('reset_on_fiscal_year', ['Yes', 'No'])->default('Yes');
            $table->string('table_name', 32)->nullable();
            $table->string('primary_key', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('const_document_type');
    }
};
