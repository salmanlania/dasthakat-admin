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
        Schema::create('control_access', function (Blueprint $table) {
            $table->increments('control_access_id'); // Using increments for an auto-incrementing primary key
            $table->string('module_name', 255);
            $table->string('form_name', 255);
            $table->string('route', 255);
            $table->string('permission_id', 16);
            $table->string('permission_name', 32);
            $table->decimal('sort_order', 11, 3)->default(0.000);        
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('control_access');
    }
};
