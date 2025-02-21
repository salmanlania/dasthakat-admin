<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('good_received_note_detail', function (Blueprint $table) {
            $table->char('good_received_note_id', 36);
            $table->char('good_received_note_detail_id', 36)->primary();
            $table->integer('sort_order');
            $table->char('product_id', 36);
            $table->string('product_name', 255)->nullable();
            $table->integer('product_type_id')->nullable();
            $table->text('description')->nullable();
            $table->char('warehouse_id', 36)->nullable();
            $table->char('unit_id', 36)->nullable();
            $table->decimal('quantity', 10, 2)->nullable();
            $table->decimal('rate', 10, 2)->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->text('vendor_notes')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->char('updated_by', 36)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('good_received_note_detail');
    }
};
