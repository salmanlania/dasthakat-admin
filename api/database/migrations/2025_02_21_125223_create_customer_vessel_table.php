<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('customer_vessel', function (Blueprint $table) {
            $table->char('customer_vessel_id', 36)->primary();
            $table->char('customer_id', 36);
            $table->char('vessel_id', 36);
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('customer_vessel');
    }
};
