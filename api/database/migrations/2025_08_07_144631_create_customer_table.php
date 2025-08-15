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
        Schema::create('customer', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('customer_id', 36)->primary();
            $table->string('name');
            $table->integer('customer_code');
            $table->char('salesman_id', 36)->nullable();
            $table->string('country')->nullable();
            $table->text('address')->nullable();
            $table->text('billing_address')->nullable();
            $table->string('phone_no')->nullable();
            $table->string('block_status', 36)->default('no'); // Assuming CHAR(36) was a typo for VARCHAR
            $table->string('email_sales')->nullable();
            $table->string('email_accounting')->nullable();
            $table->char('payment_id', 36)->nullable();
            $table->decimal('rebate_percent', 15, 2)->nullable();
            $table->tinyInteger('status');
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->unique(['company_id', 'customer_code']);
            $table->index('company_branch_id');
            $table->index('name');
            $table->index('salesman_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customer');
    }
};
