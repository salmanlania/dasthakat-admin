<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::table('quotation', function (Blueprint $table) {
            $table->decimal('total_cost', 10, 2)->default(0)->after('term_desc');
        });
    }

    public function down()
    {
        Schema::table('quotation', function (Blueprint $table) {
            $table->dropColumn(['total_cost']);
        });
    }
};
