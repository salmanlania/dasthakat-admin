<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PurchaseReturnDetail extends Model
{

    protected $table = 'purchase_return_detail';
    protected $primaryKey = 'purchase_return_detail_id';
    public $incrementing = false;
    protected $keyType = 'string';


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
    protected $casts = [
        'quantity' => 'float',
        'rate' => 'float',
        'amount' => 'float',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id')->select('*', DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function charge_order_detail()
    {
        return $this->belongsTo(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id')->select('*');
    }

    public function purchase_order_detail()
    {
        return $this->belongsTo(PurchaseOrderDetail::class, 'purchase_order_detail_id', 'purchase_order_detail_id')->select('*');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'unit_id')->select('*');
    }
}
