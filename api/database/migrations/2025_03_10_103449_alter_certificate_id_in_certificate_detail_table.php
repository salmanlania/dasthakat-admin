<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameCertifiateIdToCertificateId extends Migration
{
    public function up()
    {
        Schema::table('job_order_detail_certificate', function (Blueprint $table) {
            $table->renameColumn('certifiate_id', 'certificate_id');
        });
    }

    public function down()
    {
        Schema::table('job_order_detail_certificate', function (Blueprint $table) {
            $table->renameColumn('certificate_id', 'certifiate_id');
        });
    }
}
