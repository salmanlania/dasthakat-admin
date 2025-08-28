<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('const_document_type')->insert([
            'document_type_id' => 54,
            'document_name' => 'Stock Return',
            'document_prefix' => '{BC}/STR-',
            'table_name' => 'stock_return',
            'primary_key' => 'stock_return_id',
        ]);
    }

    public function down(): void
    {
        DB::table('const_document_type')->where('document_type_id', 54)->delete();
    }
};
