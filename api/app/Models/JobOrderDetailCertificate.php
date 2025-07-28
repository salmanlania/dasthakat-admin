<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOrderDetailCertificate extends Model
{
    protected $table = 'job_order_detail_certificate';
    protected $primaryKey = 'certificate_id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'certificate_id',
        'job_order_id',
        'job_order_detail_id',
        'sort_order',
        'type',
        'certificate_number',
        'certificate_date',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by'
    ];
}
