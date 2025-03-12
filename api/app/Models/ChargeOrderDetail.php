<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
        "product_description",
        "product_type_id",
        "warehouse_id",
        "description",
        "unit_id",
        "supplier_id",
        "purchase_order_id",
        "purchase_order_detail_id",
        "quotation_detail_id",
        "internal_notes",
        "picklist_id",
        "job_order_id",
        "picklist_detail_id",
        "job_order_detail_id",
        "servicelist_id",
        "servicelist_detail_id",
        "quantity",
        "cost_price",
        "rate",
        "amount",
        "discount_amount",
        "discount_percent",
        "gross_amount",
        "created_by",
        "updated_by"
    ];
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id','charge_order_id')->select('*');
    }
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id','product_id')->select('*',DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function product_type()
    {
        return $this->hasOne(ProductType::class, 'product_type_id','product_type_id');
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
