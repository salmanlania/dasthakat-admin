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
        Schema::create('audit', function (Blueprint $table) {
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->increments('audit_id');
            $table->char('action', 36)->nullable();
            $table->char('action_on', 40)->nullable();
            $table->char('action_by', 36)->nullable();
            $table->dateTime('action_at')->nullable();
            $table->string('document_type', 255)->nullable();
            $table->char('document_id', 36);
            $table->string('document_name', 255)->nullable();
            $table->binary('json_data')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('audit');
    }
};