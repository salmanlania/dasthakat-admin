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
            $table->string('product_type_id', 36)->nullable()->after('product_id');
            $table->string('product_name')->nullable()->after('product_type_id');
            $table->text('product_description')->nullable()->after('product_name');
            $table->text('description')->nullable()->after('product_description');
            $table->text('internal_notes')->nullable()->after('description');
            $table->decimal('quantity', 15, 2)->nullable()->after('internal_notes');
            $table->string('unit_id', 36)->nullable()->after('quantity');
            $table->string('supplier_id', 36)->nullable()->after('unit_id');

            // Ensure existing columns are properly typed (in case they need adjustment)
            $table->string('shipment_id', 36)->change();
            $table->string('shipment_detail_id', 36)->change();
            $table->integer('sort_order')->default(0)->change();
            $table->string('charge_order_id', 36)->nullable()->change();
            $table->string('charge_order_detail_id', 36)->nullable()->change();
            $table->string('product_id', 36)->nullable()->change();
            $table->timestamp('created_at')->nullable()->change();
            $table->string('created_by', 36)->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
            $table->string('updated_by', 36)->nullable()->change();
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

            // Revert changes to existing columns (optional, adjust as needed)
            $table->string('shipment_id', 36)->change();
            $table->string('shipment_detail_id', 36)->change();
            $table->integer('sort_order')->default(0)->change();
            $table->string('charge_order_id', 36)->nullable()->change();
            $table->string('charge_order_detail_id', 36)->nullable()->change();
            $table->string('product_id', 36)->nullable()->change();
            $table->timestamp('created_at')->nullable()->change();
            $table->string('created_by', 36)->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
            $table->string('updated_by', 36)->nullable()->change();
        });
    }
};
