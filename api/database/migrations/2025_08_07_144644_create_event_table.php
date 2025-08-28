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
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_branch_id', 36);
            $table->char('company_id', 36);
            $table->char('event_id', 36)->primary();
            $table->integer('event_no');
            $table->char('event_code', 36)->unique();
            $table->char('customer_id', 36);
            $table->char('vessel_id', 36);
            $table->char('class1_id', 36)->nullable();
            $table->char('class2_id', 36)->nullable();
            $table->boolean('status')->default(true);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('company_id');
            $table->index('company_branch_id');
            $table->index('customer_id');
            $table->index('vessel_id');
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
