<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('event', function (Blueprint $table) {
        
            $table->char('sales_team_id', 36)->nullable()->after('class2_id');
            $table->index('sales_team_id');
        });
    }

    public function down()
    {
        Schema::table('event', function (Blueprint $table) {
            $table->dropIndex(['sales_team_id']);
            $table->dropColumn('sales_team_id');
        });
    }
};
