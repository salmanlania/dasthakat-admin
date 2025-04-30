<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SaleInvoiceDetail extends Model
{

    protected $table = 'sale_invoice_detail';
    protected $primaryKey = 'sale_invoice_detail_id';
    public $incrementing = false;


    protected $fillable = [
        "sale_invoice_id",
        "sale_invoice_detail_id",
        "charge_order_detail_id",
        "sort_order",
        "product_id",
        "product_name",
        "product_description",
        "description",
        "unit_id",
        "quantity",
        "rate",
        "amount",
        "created_by",
        "updated_by"
    ];
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id', 'product_id')->select('*',DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function charge_order_detail()
    {
        return $this->hasOne(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id');
    }
    public function unit()
    {
        return $this->hasOne(Unit::class, 'unit_id', 'unit_id');
    }
  
}
