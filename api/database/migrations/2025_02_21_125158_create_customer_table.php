<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('customer', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('customer_id', 36)->primary();
            $table->string('name', 255);
            $table->integer('customer_code');
            $table->char('salesman_id', 36)->nullable();
            $table->string('country', 255)->nullable();
            $table->text('address')->nullable();
            $table->string('billing_address', 255)->nullable();
            $table->string('phone_no', 255)->nullable();
            $table->string('email_sales', 255)->nullable();
            $table->string('email_accounting', 255)->nullable();
            $table->char('payment_id', 36)->nullable();
            $table->decimal('rebate_percent', 10, 3)->nullable();
            $table->tinyInteger('status');
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('customer');
    }
};
