<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::table('const_document_type')->insert([
            [
                'document_type_id' => '48',
                'document_name' => 'Delivery Order',
                'document_prefix' => '{BC}/DO-',
                'zero_padding' => 4,
                'reset_on_fiscal_year' => 'Yes',
                'table_name' => 'shipment',
                'route' => null,
                'primary_key' => 'shipment_id',
            ],
            [
                'document_type_id' => '49',
                'document_name' => 'Service Order',
                'document_prefix' => '{BC}/SO-',
                'zero_padding' => 4,
                'reset_on_fiscal_year' => 'Yes',
                'table_name' => 'shipment',
                'route' => null,
                'primary_key' => 'shipment_id',
            ],
        ]);
    }

    public function down()
    {
        DB::table('const_document_type')->whereIn('document_type_id', ['48', '49'])->delete();
    }
};
