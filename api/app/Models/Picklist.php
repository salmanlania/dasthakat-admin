<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Picklist extends Model
{

    protected $table = 'picklist';
    protected $primaryKey = 'picklist_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "picklist_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "charge_order_id",
        "total_quantity",
        "is_deleted",
        "created_by",
        "updated_by"
    ];
    protected $casts = [
        'total_quantity' => 'float',
    ];


    public function picklist_detail()
    {
        return $this->hasMany(PicklistDetail::class, 'picklist_id', 'picklist_id')->orderBy('sort_order');
    }

    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id');
    }
}
