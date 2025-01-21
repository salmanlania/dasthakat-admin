<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class PurchaseOrderDetail extends Model
{

    protected $table = 'purchase_order_detail';
    protected $primaryKey = 'purchase_order_detail_id';
    public $incrementing = false;


    protected $fillable = [
        "purchase_order_id",
        "purchase_order_detail_id",
        "sort_order",
        "product_id",
        "description",
        "vpart",
        "unit_id",
        "quantity",
        "rate",
        "amount",
        "vendor_notes",
        "created_by",
        "updated_by"
    ];
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id', 'product_id');
    }
    public function unit()
    {
        return $this->hasOne(Unit::class, 'unit_id', 'unit_id');
    }
  
}
