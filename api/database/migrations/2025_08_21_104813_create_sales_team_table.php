<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('sales_team', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('sales_team_id', 36)->primary();
            $table->string('name', 255);
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();

            $table->index('company_id');
            $table->index('company_branch_id');
            $table->index('name');

        });
        
    }

    public function down() {
        Schema::dropIfExists('sales_team');
    }
};
