<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('servicelist_received', function (Blueprint $table) {
            $table->char('servicelist_received_id', 36)->primary();
            $table->char('company_id', 36);
            $table->char('company_branch_id', 36);
            $table->integer('document_type_id');
            $table->integer('document_no');
            $table->string('document_prefix', 50);
            $table->string('document_identity', 100);
            $table->dateTime('document_date')->nullable();
            $table->char('servicelist_id', 36);
            $table->decimal('total_quantity', 10, 2)->default(0);
            $table->char('created_by', 36);
            $table->char('updated_by', 36);
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('servicelist_received');
    }
};
