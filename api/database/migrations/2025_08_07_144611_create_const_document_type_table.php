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
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->increments('document_type_id'); // INT(11) NOT NULL AUTO_INCREMENT
            $table->string('document_name');
            $table->string('document_prefix');
            $table->tinyInteger('zero_padding')->default(4);
            $table->enum('reset_on_fiscal_year', ['Yes', 'No'])->default('Yes');
            $table->string('table_name')->nullable();
            $table->string('route')->nullable();
            $table->string('primary_key')->nullable();
            
            // Indexes
            $table->unique('document_name');
            $table->unique('document_prefix');
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
