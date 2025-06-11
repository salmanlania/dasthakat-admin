<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purhcase_return_detail', function (Blueprint $table) {
            $table->char('warehouse_id', 36)->nullable()->after('description');
        });
   

    }

    public function down(): void
    {
        
        Schema::table('purhcase_return_detail', function (Blueprint $table) {
            $table->dropColumn('warehouse_id');
        });

    }
};
