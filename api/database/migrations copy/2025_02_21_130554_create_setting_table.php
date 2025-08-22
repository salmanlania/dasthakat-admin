<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('setting', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('module', 255)->nullable();
            $table->string('field', 255);
            $table->string('value', 255)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('setting');
    }
};
