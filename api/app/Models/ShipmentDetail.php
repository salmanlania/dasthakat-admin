<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentDetail extends Model
{
    protected $table = 'shipment_detail';
    protected $primaryKey = 'shipment_detail_id';
    public $incrementing = false;
    protected $fillable = [
        'shipment_id',
        'shipment_detail_id',
        'sort_order',
        'charge_order_id',
        'charge_order_detail_id',
        'product_id',
        'product_type_id',
        'product_name',
        'product_description',
        'description',
        'internal_notes',
        'quantity',
        'unit_id',
        'supplier_id',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
    ];

    public function shipment()
    {
        return $this->hasOne(Shipment::class, 'shipment_id', 'shipment_id')->select('*');
    }
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id')->select('*');
    }

    public function charge_order_detail()
    {
        return $this->hasOne(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id')->select('*');
    }
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id', 'product_id')->select('*');
    }
    public function product_type()
    {
        return $this->hasOne(ProductType::class, 'product_type_id', 'product_type_id')->select('*');
    }
    public function unit()
    {
        return $this->hasOne(Unit::class, 'unit_id', 'unit_id')->select('*');
    }
    public function supplier()
    {
        return $this->hasOne(Supplier::class, 'supplier_id', 'supplier_id')->select('*');
    }
}
