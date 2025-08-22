<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('job_order', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('job_order_id', 36)->primary();
            $table->integer('document_type_id')->notNull();
            $table->integer('document_no')->notNull();
            $table->string('document_prefix', 50)->nullable();
            $table->string('document_identity', 100)->nullable();
            $table->dateTime('document_date')->nullable();
            $table->char('event_id', 36)->nullable();
            $table->char('customer_id', 36)->nullable();
            $table->char('vessel_id', 36)->nullable();
            $table->char('flag', 36)->nullable();
            $table->char('class1', 36)->nullable();
            $table->char('class2', 36)->nullable();
            $table->char('agent_id', 36)->nullable();
            $table->char('salesman_id', 36)->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('job_order');
    }
};
