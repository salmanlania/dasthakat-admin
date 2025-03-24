<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('shipment', function (Blueprint $table) {
            $table->char('shipment_id', 36)->primary();
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->char('document_type_id', 36)->nullable();
            $table->integer('document_no');
            $table->string('document_prefix')->nullable();
            $table->string('document_identity')->nullable();
            $table->date('document_date')->nullable();
            $table->char('charge_order_id', 36)->nullable();
            $table->char('event_id', 36)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->char('created_by', 36)->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->char('updated_by', 36)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shipment');
    }
};
