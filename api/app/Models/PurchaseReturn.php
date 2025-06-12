<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class PurchaseReturn extends Model
{

    protected $table = 'purchase_return';
    protected $primaryKey = 'purchase_return_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "purchase_return_id",
        "sale_return_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "charge_order_id",
        "purchase_order_id",
        "total_quantity",
        "total_amount",
        "status",
        "created_by",
        "updated_by"
    ];

    public function purchase_return_detail()
    {
        return $this->hasMany(PurchaseReturnDetail::class, 'purchase_return_id', 'purchase_return_id')->orderBy('sort_order');
    }


    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id')->select('*');
    }

    public function purchase_order()
    {
        return $this->hasOne(PurchaseOrder::class, 'purchase_order_id', 'purchase_order_id')->select('*');
    }
}
