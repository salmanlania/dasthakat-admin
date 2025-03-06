<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        DB::table('const_document_type')->insert([
            [
                'document_type_id' => 46,
                'document_name' => 'Service List',
                'document_prefix' => '{BC}/SL-',
                'table_name' => 'servicelist',
                'primary_key' => 'servicelist_id',
            ],
            [
                'document_type_id' => 47,
                'document_name' => 'Service List Received',
                'document_prefix' => '{BC}/SLR-',
                'table_name' => 'servicelist_received',
                'primary_key' => 'servicelist_received_id',
            ]
        ]);
    }

    public function down()
    {
        DB::table('const_document_type')->whereIn('document_type_id', [46, 47])->delete();
    }
};
