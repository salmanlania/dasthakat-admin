<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class StockReturnDetail extends Model
{

    protected $table = 'stock_return_detail';
    protected $primaryKey = 'stock_return_detail_id';
    public $incrementing = false;


    protected $fillable = [
        "stock_return_id",
        "stock_return_detail_id",
        "charge_order_detail_id",
        "picklist_detail_id",
        "sort_order",
        "product_id",
        "product_name",
        "product_description",
        "description",
        "unit_id",
        "warehouse_id",
        "quantity",
        "rate",
        "amount",
        "created_by",
        "updated_by"
    ];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id')->select('*',DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function charge_order_detail()
    {
        return $this->belongsTo(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id')->select('*');
    }

    public function picklist_detail()
    {
        return $this->belongsTo(PicklistDetail::class, 'picklist_detail_id', 'picklist_detail_id')->select('*');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'unit_id')->select('*');
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'warehouse_id')->select('*');
    }
  
}
