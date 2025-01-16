<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration {
    public function up()
    {
        Schema::create('control_access', function (Blueprint $table) {
            $table->increments('control_access_id');
            $table->string('module_name', 255);
            $table->string('form_name', 255);
            $table->string('route', 255);
            $table->string('permission_id', 16);
            $table->string('permission_name', 32)->nullable();
            $table->decimal('sort_order', 11, 3)->default(0.000);
        });
    }

    public function down()
    {
        Schema::dropIfExists('control_access');
    }
};
