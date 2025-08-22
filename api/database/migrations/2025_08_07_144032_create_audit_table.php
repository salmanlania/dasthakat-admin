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
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->increments('audit_id'); // INT(11) unsigned NOT NULL AUTO_INCREMENT
            $table->char('action', 36)->nullable();
            $table->string('action_on', 40)->nullable();
            $table->char('action_by', 36)->nullable();
            $table->dateTime('action_at')->nullable();
            $table->string('document_type')->nullable();
            $table->char('document_id', 36);
            $table->string('document_name')->nullable();
            $table->text('json_data')->nullable();

            // Indexes for searching audit trail
            $table->index(['document_type', 'document_id']);
            $table->index('action_by');
            $table->index('action_at');
            $table->index('company_id');
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
