<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('salesman', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('salesman_id', 36)->primary();
            $table->string('name', 255);
            $table->decimal('commission_percentage', 10, 2)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('salesman');
    }
};
