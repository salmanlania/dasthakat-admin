<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servicelist extends Model
{

    protected $table = 'servicelist';
    protected $primaryKey = 'servicelist_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "servicelist_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "charge_order_id",
        "total_quantity",
        "created_by",
        "updated_by"
    ];

    public function servicelist_detail()
    {
        return $this->hasMany(PicklistDetail::class, 'servicelist_id', 'servicelist_id')->orderBy('sort_order');
    }

    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id');
    }
}
