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
        Schema::create('control_access', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            
            $table->increments('control_access_id'); // INT(11) unsigned NOT NULL AUTO_INCREMENT
            $table->string('module_name');
            $table->string('form_name');
            $table->string('route')->nullable();
            $table->char('permission_id', 36);
            $table->string('permission_name')->nullable();
            $table->decimal('sort_order', 15, 2)->default(0.00);

            // Indexes
            $table->index('permission_id');
            $table->index(['module_name', 'form_name']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('control_access');
    }
};
