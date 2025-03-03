<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        DB::table('const_document_type')->insert([
            'document_type_id' => 45,
            'document_name' => 'Internal Job Order',
            'document_prefix' => '{BC}/IJO-',
            'table_name' => 'job_order',
            'primary_key' => 'job_order_id',
        ]);
    }

    public function down()
    {
        DB::table('const_document_type')->where('document_type_id', 45)->delete();
    }
};
