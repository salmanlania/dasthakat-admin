<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class SaleInvoice extends Model
{

    protected $table = 'sale_invoice';
    protected $primaryKey = 'sale_invoice_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "sale_invoice_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        // "ship_date",
        "vessel_billing_address",
        "charge_order_id",
        "total_quantity",
        "total_amount",
        "created_by",
        "updated_by"
    ];
    protected $casts = [
        'total_quantity' => 'float',
        'total_amount' => 'float',
    ];

  
    public function sale_invoice_detail()
    {
        return $this->hasMany(SaleInvoiceDetail::class, 'sale_invoice_id','sale_invoice_id')->orderBy('sort_order');
    }
   
   
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id','charge_order_id')->select('*');
    }
   
}
