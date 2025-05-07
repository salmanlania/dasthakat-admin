<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class PurchaseInvoice extends Model
{

    protected $table = 'purchase_invoice';
    protected $primaryKey = 'purchase_invoice_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "purchase_invoice_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "required_date",
        "vendor_invoice_no",
        "supplier_id",
        "buyer_id",
        "ship_via",
        "ship_to",
        "department",
        "charge_order_id",
        "purchase_order_id",
        "payment_id",
        "remarks",
        "freight",
        "total_quantity",
        "total_amount",
        "created_by",
        "updated_by"
    ];
  
    public function purchase_invoice_detail()
    {
        return $this->hasMany(PurchaseInvoiceDetail::class, 'purchase_invoice_id','purchase_invoice_id')->orderBy('sort_order');
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

    public function purchase_order(){
        return $this->hasOne(PurchaseOrder::class, 'purchase_order_id','purchase_order_id')->select('*');
    }
   

    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id','charge_order_id')->select('*');
    }
   
}
