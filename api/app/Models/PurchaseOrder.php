<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class PurchaseOrder extends Model
{

    protected $table = 'purchase_order';
    protected $primaryKey = 'purchase_order_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "purchase_order_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "required_date",
        "supplier_id",
        "buyer_id",
        "ship_via",
        "ship_to",
        "department",
        "type",
        "quotation_id",
        "charge_order_id",
        "payment_id",
        "remarks",
        "total_quantity",
        "total_amount",
        "is_deleted",
        "created_by",
        "updated_by"
    ];
    protected $casts = [
        'total_quantity' => 'float',
        'total_amount' => 'float',
    ];
    
    public function purchase_order_detail()
    {
        return $this->hasMany(PurchaseOrderDetail::class, 'purchase_order_id','purchase_order_id')->orderBy('sort_order');
    }
   
    public function payment()
    {
        return $this->hasOne(Payment::class, 'payment_id','payment_id')->select('payment_id', 'name');
    }
   
    public function user()
    {
        return $this->hasOne(User::class, 'user_id','buyer_id')->select('user_id', 'email','user_name');
    }
   
    public function supplier()
    {
        return $this->hasOne(Supplier::class, 'supplier_id','supplier_id')->select('*');
    }

    public function quotation()
    {
        return $this->hasOne(Quotation::class, 'quotation_id','quotation_id')->select('*');
    }
   
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id','charge_order_id')->select('*');
    }
   
}
