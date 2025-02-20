<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PicklistReceived extends Model
{

    protected $table = 'picklist_received';
    protected $primaryKey = 'picklist_received_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "picklist_received_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "picklist_id",
        "total_quantity",
        "created_by",
        "updated_by"
    ];

    public function picklist_received_detail()
    {
        return $this->hasMany(PicklistReceivedDetail::class, 'picklist_received_id', 'picklist_received_id')->orderBy('sort_order');
    }

    public function picklist()
    {
        return $this->hasOne(Picklist::class, 'picklist_id', 'picklist_id');
    }
}
