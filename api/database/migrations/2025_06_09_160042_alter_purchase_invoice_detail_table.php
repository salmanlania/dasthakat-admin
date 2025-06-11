<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_invoice_detail', function (Blueprint $table) {
            $table->char('purchase_order_detail_id', 36)->nullable()->after('purchase_invoice_detail_id');
        });
   

    }

    public function down(): void
    {
        
        Schema::table('purchase_invoice_detail', function (Blueprint $table) {
            $table->dropColumn('purchase_order_detail_id');
        });

    }
};
