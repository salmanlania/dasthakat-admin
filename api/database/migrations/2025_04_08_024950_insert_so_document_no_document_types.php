<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::table('const_document_type')->insert([
            ['document_type_id' => 50, 'document_name' => 'SO Document Number', 'document_prefix' => '{BC}/DN-', 'zero_padding' => 4, 'reset_on_fiscal_year' => 'Yes', 'table_name' => 'service_order', 'primary_key' => 'service_order_id']
        ]);
    }

    public function down()
    {
        DB::table('const_document_type')->whereIn('document_type_id', [50])->delete();
    }
};
