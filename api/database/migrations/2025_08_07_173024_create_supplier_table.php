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
        Schema::create('supplier', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('supplier_id', 36)->primary();
            $table->char('payment_id', 36)->nullable();
            $table->string('name');
            $table->string('supplier_code', 40)->unique();
            $table->string('location')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact1', 40)->nullable();
            $table->string('contact2', 40)->nullable();
            $table->string('email')->nullable()->unique();
            $table->text('address')->nullable();
            $table->boolean('status')->default(true);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['company_id', 'company_branch_id']);
            $table->index('name');
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
        Schema::dropIfExists('supplier');
    }
};
