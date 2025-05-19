<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PurchaseReturnDetail extends Model
{

    protected $table = 'purchase_return_detail';
    protected $primaryKey = 'purchase_return_detail_id';
    public $incrementing = false;


    protected $fillable = [
        "purchase_return_id",
        "purchase_return_detail_id",
        "charge_order_detail_id",
        "purchase_order_detail_id",
        "sort_order",
        "product_id",
        "product_name",
        "product_description",
        "description",
        "warehouse_id",
        "unit_id",
        "vpart",
        "quantity",
        "rate",
        "amount",
        "vendor_notes",
        "created_by",
        "updated_by"
    ];
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id', 'product_id')->select('*', DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function charge_order_detail()
    {
        return $this->hasOne(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id');
    }

    public function purchase_order_detail()
    {
        return $this->hasOne(PurchaseOrderDetail::class, 'purchase_order_detail_id', 'purchase_order_detail_id');
    }
    public function unit()
    {
        return $this->hasOne(Unit::class, 'unit_id', 'unit_id');
    }
}
