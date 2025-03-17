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
        Schema::create('technician', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('technician_id', 36)->primary();
            $table->string('name', 255);
            $table->char('created_by', 36);
            $table->char('updated_by', 36);
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('technician');
    }
};
