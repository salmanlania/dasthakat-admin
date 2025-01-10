<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ChargeOrderDetail extends Model
{

    protected $table = 'charge_order_detail';
    protected $primaryKey = 'charge_order_detail_id';
    public $incrementing = false;


    protected $fillable = [
        "charge_order_id",
        "charge_order_detail_id",
        "sort_order",
        "product_code",
        "product_id",
        "product_name",
        "product_type",
        "description",
        "quantity",
        "unit_id",
        "supplier_id",
        "created_by",
        "updated_by"
    ];
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id','product_id');
    }
    public function unit()
    {
        return $this->hasOne(Unit::class, 'unit_id','unit_id');
    }
    public function supplier()
    {
        return $this->hasOne(Supplier::class, 'supplier_id','supplier_id');
    }
}
