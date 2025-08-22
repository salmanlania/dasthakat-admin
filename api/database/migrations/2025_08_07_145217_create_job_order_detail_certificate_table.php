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
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('certificate_id', 36)->primary();
            $table->integer('sort_order')->default(0);
            $table->char('job_order_id', 36);
            $table->char('job_order_detail_id', 36);
            $table->string('type')->nullable();
            $table->string('certificate_number');
            $table->dateTime('certificate_date')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('job_order_id');
            $table->index('job_order_detail_id');
            $table->index('certificate_number');
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
