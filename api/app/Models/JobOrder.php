<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class JobOrder extends Model
{

    protected $table = 'job_order';
    protected $primaryKey = 'job_order_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "job_order_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "event_id",
        "created_by",
        "updated_by"
    ];


    public function event()
    {
        return $this->hasOne(Event::class, 'event_id', 'event_id')->select('*');
    }
}
