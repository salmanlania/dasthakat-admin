<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('product_type', function (Blueprint $table) {
            $table->increments('product_type_id');
            $table->char('name', 36)->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('created_at')->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('product_type');
    }
};
