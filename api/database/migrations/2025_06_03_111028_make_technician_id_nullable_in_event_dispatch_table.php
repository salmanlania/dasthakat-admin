<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('event_dispatch', function (Blueprint $table) {
            if (Schema::hasColumn('event_dispatch', 'technician_id')) {
                $table->dropColumn('technician_id');
            }
        });

        Schema::table('event_dispatch', function (Blueprint $table) {
            $table->json('technician_id')->nullable()->after('event_id');
        });
    }

    public function down()
    {
        Schema::table('event_dispatch', function (Blueprint $table) {
            $table->dropColumn('technician_id'); 
            $table->json('technician_id')->nullable(false)->after('event_id');
        });
    }
};
