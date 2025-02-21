<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('supplier', function (Blueprint $table) {
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->char('supplier_id', 36)->primary();
            $table->string('name', 255)->nullable();
            $table->char('supplier_code', 40)->nullable();
            $table->string('location', 255)->nullable();
            $table->string('contact_person', 255)->nullable();
            $table->char('contact1', 40)->nullable();
            $table->char('contact2', 40)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('address', 255)->nullable();
            $table->boolean('status')->default(1);
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('supplier');
    }
};
