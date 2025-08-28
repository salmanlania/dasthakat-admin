<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('purchase_invoice', function (Blueprint $table) {
            $table->char('company_id', 36)->nullable();
            $table->char('company_branch_id', 36)->nullable();
            $table->char('purchase_invoice_id', 36)->primary();
            $table->char('document_type_id', 36)->nullable();
            $table->string('document_no', 100)->nullable();
            $table->string('document_prefix', 50)->nullable();
            $table->string('document_identity', 100)->nullable();
            $table->date('document_date')->notNull();
            $table->date('required_date')->nullable();
            $table->char('supplier_id', 36)->nullable();
            $table->char('buyer_id', 36)->nullable();
            $table->string('ship_via', 100)->nullable();
            $table->string('ship_to', 255)->nullable();
            $table->string('department', 100)->nullable();
            $table->char('good_received_note_id', 36)->nullable();
            $table->char('quotation_id', 36)->nullable();
            $table->char('charge_order_id', 36)->nullable();
            $table->char('payment_id', 36)->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('total_quantity', 10, 2)->default(0.00);
            $table->decimal('total_amount', 15, 2)->default(0.00);
            $table->dateTime('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down() {
        Schema::dropIfExists('purchase_invoice');
    }
};
