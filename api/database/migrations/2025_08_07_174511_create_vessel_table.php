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
        Schema::create('vessel', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('vessel_id', 36)->primary();
            $table->char('customer_id', 36)->nullable();
            $table->char('flag_id', 36)->nullable();
            $table->char('class1_id', 36)->nullable();
            $table->char('class2_id', 36)->nullable();
            $table->string('name');
            $table->string('imo', 40)->nullable()->unique();
            $table->text('billing_address')->nullable();
            // Changed from CHAR(36) to boolean for efficiency
            $table->boolean('block_status')->default(false);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['company_id', 'company_branch_id']);
            $table->index('customer_id');
            $table->index('flag_id');
            $table->index('name');
            $table->index('block_status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vessel');
    }
};
