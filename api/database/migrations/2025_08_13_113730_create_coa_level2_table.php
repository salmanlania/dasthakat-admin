<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('coa_level2', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->char('coa_level2_id', 36)->primary();
            $table->char('company_id', 36)->nullable();
            $table->char('coa_level1_id', 36)->nullable();
            $table->char('level2_code', 3)->nullable();
            $table->string('name', 255)->nullable();
            $table->tinyInteger('status')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();

            // Add indexes for better query performance
            $table->unique(['coa_level1_id', 'level2_code']);
            $table->index('company_id');
            $table->index('coa_level1_id');
            $table->index('name');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coa_level2');
    }
};
