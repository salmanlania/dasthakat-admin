<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('const_gl_type', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->increments('gl_type_id');
            $table->string('name', 32)->nullable();

            // Add indexes for better query performance
            $table->index('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('const_gl_type');
    }
};
