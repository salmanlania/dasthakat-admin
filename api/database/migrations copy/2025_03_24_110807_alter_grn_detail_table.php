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
    public function up(): void
    {
        Schema::table('good_received_note_detail', function (Blueprint $table) {
            $table->integer('document_currency_id')->nullable()->after('unit_id');
            $table->integer('base_currency_id')->nullable()->after('document_currency_id');
            $table->decimal('unit_conversion', 10, 2)->nullable()->after('base_currency_id');
            $table->decimal('currency_conversion', 10, 2)->nullable()->after('unit_conversion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('good_received_note_detail', function (Blueprint $table) {
            $table->dropColumn([
                'document_currency_id',
                'base_currency_id',
                'unit_conversion',
                'currency_conversion',
            ]);
        });
    }
};
