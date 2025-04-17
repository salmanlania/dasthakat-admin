<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::table('charge_order_detail', function (Blueprint $table) {
            $table->string('vendor_part_no', 255)->nullable()->after('supplier_id');
            $table->decimal('markup', 10, 2)->default(0)->after('cost_price');
        });
    }

    public function down()
    {
        Schema::table('charge_order_detail', function (Blueprint $table) {
            $table->dropColumn(['vendor_part_no', 'markup']);
        });
    }
};
