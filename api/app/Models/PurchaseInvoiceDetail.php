<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PurchaseInvoiceDetail extends Model
{

    protected $table = 'purchase_invoice_detail';
    protected $primaryKey = 'purchase_invoice_detail_id';
    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = [
        "purchase_invoice_id",
        "purchase_invoice_detail_id",
        "sort_order",
        "charge_order_detail_id",
        "purchase_order_detail_id",
        "product_id",
        "product_name",
        "product_description",
        "description",
        "vpart",
        "unit_id",
        "po_price",
        "quantity",
        "rate",
        "amount",
        "vendor_notes",
        "created_by",
        "updated_by"
    ];
    protected $casts = [
        'po_price' => 'float',
        'quantity' => 'float',
        'rate' => 'float',
        'amount' => 'float',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id')->select('*',DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function charge_order_detail()
    {
        return $this->belongsTo(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id')->select('*');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'unit_id')->select('*');
    }
  
}
