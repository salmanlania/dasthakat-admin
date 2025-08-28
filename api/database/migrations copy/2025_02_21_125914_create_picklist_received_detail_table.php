<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('picklist_received_detail', function (Blueprint $table) {
            $table->char('picklist_received_detail_id', 36)->primary();
            $table->char('picklist_received_id', 36)->nullable();
            $table->char('picklist_detail_id', 36)->nullable();
            $table->integer('sort_order')->notNull();
            $table->char('product_id', 36)->nullable();
            $table->decimal('quantity', 10, 2)->default(0.00);
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('picklist_received_detail');
    }
};
