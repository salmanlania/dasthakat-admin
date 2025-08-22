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
        Schema::create('job_order_detail_certificate', function (Blueprint $table) {
            $table->char('certifiate_id', 36)->primary();
            $table->char('job_order_id', 36);
            $table->char('job_order_detail_id', 36);
            $table->integer('document_type_id');
            $table->integer('document_no');
            $table->string('document_prefix', 50);
            $table->string('document_identity', 100);
            $table->dateTime('document_date')->nullable();
            $table->char('created_by', 36);
            $table->char('updated_by', 36);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();

            $table->index('job_order_id');
            $table->index('job_order_detail_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('job_order_detail_certificate');
    }
};
