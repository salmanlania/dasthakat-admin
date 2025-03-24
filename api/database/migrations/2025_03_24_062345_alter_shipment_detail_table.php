<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('shipment_detail', function (Blueprint $table) {
            // Add new columns
            $table->char('product_type_id', 36)->nullable()->after('product_id');
            $table->char('product_name')->nullable()->after('product_type_id');
            $table->text('product_description')->nullable()->after('product_name');
            $table->text('description')->nullable()->after('product_description');
            $table->text('internal_notes')->nullable()->after('description');
            $table->decimal('quantity', 10, 2)->nullable()->after('internal_notes');
            $table->char('unit_id', 36)->nullable()->after('quantity');
            $table->char('supplier_id', 36)->nullable()->after('unit_id');
        });
    }

    public function down()
    {
        Schema::table('shipment_detail', function (Blueprint $table) {
            // Drop the newly added columns
            $table->dropColumn([
                'product_type_id',
                'product_name',
                'product_description',
                'description',
                'internal_notes',
                'quantity',
                'unit_id',
                'supplier_id',
            ]);
        });
    }
};
