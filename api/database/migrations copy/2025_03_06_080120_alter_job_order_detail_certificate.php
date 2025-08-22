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
        Schema::table('job_order_detail_certificate', function (Blueprint $table) {

            // Drop old columns if they exist
            $table->dropColumn(['document_no', 'document_date','document_type_id','document_prefix','document_identity']);

            // Add new columns
            $table->string('certificate_number', 100)->after('job_order_detail_id');
            $table->dateTime('certificate_date')->nullable()->after('certificate_number');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_order_detail_certificate', function (Blueprint $table) {
            // Drop new columns
            $table->dropColumn(['certificate_number', 'certificate_date']);

            // Restore old columns
            $table->integer('document_no')->after('job_order_detail_id');
            $table->dateTime('document_date')->nullable()->after('document_no');
            $table->integer('document_type_id')->after('document_date');
            $table->string('document_prefix', 50)->after('document_type_id');
            $table->string('document_identity', 100)->after('document_prefix');
        });
    }
};
