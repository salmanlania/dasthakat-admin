<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicelistReceived extends Model
{

    protected $table = 'servicelist_received';
    protected $primaryKey = 'servicelist_received_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "servicelist_received_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "servicelist_id",
        "total_quantity",
        "created_by",
        "updated_by"
    ];

    public function servicelist_received_detail()
    {
        return $this->hasMany(PicklistReceivedDetail::class, 'servicelist_received_id', 'servicelist_received_id')->orderBy('sort_order');
    }

    public function servicelist()
    {
        return $this->hasOne(Picklist::class, 'servicelist_id', 'servicelist_id');
    }
}
