<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PurchaseOrderDetail extends Model
{

    protected $table = 'purchase_order_detail';
    protected $primaryKey = 'purchase_order_detail_id';
    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = [
        "purchase_order_id",
        "purchase_order_detail_id",
        "charge_order_detail_id",
        "sort_order",
        "product_id",
        "product_type_id",
        "product_name",
        "product_description",
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
    protected $casts = [
        'quantity' => 'float',
        'rate' => 'float',
        'amount' => 'float',
    ];

    public function purchase_order()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_order_id', 'purchase_order_id')->select('*');
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id')->select('*',DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function product_type()
    {
        return $this->belongsTo(ProductType::class, 'product_type_id','product_type_id')->select('*');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'unit_id')->select('*');
    }
  
}
