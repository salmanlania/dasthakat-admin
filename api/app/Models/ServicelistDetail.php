<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicelistDetail extends Model
{

    protected $table = 'servicelist_detail';
    protected $primaryKey = 'servicelist_detail_id';
    public $incrementing = false;

    protected $fillable = [
        "servicelist_id",
        "servicelist_detail_id",
        "sort_order",
        "charge_order_detail_id",
        "product_id",
        "quantity",
        "created_by",
        "updated_by"
    ];
    public function charge_order_detail()
    {
        return $this->hasOne(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id');
    }
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id', 'product_id');
    }
}
