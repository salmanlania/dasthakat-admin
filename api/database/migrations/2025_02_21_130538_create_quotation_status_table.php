<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('quotation_status', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('quotation_id', 36);
            $table->string('status', 255);
            $table->char('created_by', 36);
            $table->dateTime('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('quotation_status');
    }
};
