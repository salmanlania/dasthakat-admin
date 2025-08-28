<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('picklist_received_detail', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('picklist_received_detail_id', 36)->primary();
            $table->char('picklist_received_id', 36);
            $table->integer('sort_order');
            $table->char('charge_order_detail_id', 36)->nullable();
            $table->char('picklist_detail_id', 36);
            $table->char('product_id', 36);
            $table->char('warehouse_id', 36)->nullable();
            $table->string('remarks')->nullable();
            $table->decimal('quantity', 15, 2)->default(0.00);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->timestamps();

            // Indexes
            $table->index('picklist_received_id');
            $table->index('picklist_detail_id');
            $table->index('product_id');
            $table->index('warehouse_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('picklist_received_detail');
    }
};
