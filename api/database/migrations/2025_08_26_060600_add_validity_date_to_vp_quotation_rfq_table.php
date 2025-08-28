<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vp_quotation_rfq', function (Blueprint $table) {
            if (!Schema::hasColumn('vp_quotation_rfq', 'validity_date')) {
                $table->date('validity_date')->nullable()->after('date_returned');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vp_quotation_rfq', function (Blueprint $table) {
            if (Schema::hasColumn('vp_quotation_rfq', 'validity_date')) {
                $table->dropColumn('validity_date');
            }
        });
    }
};
