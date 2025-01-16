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
        Schema::create('event', function (Blueprint $table) {
            $table->char('company_branch_id', 36);
            $table->char('company_id', 36);
            $table->char('event_id', 36)->primary();
            $table->integer('event_no');
            $table->char('event_code', 36);
            $table->char('customer_id', 36);
            $table->char('vessel_id', 36);
            $table->char('class1_id', 36)->nullable();
            $table->char('class2_id', 36)->nullable();
            $table->tinyInteger('status')->default(1);
            $table->timestamps(0);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('event');
    }
};
