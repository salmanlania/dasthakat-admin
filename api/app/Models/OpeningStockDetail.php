<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OpeningStockDetail extends Model
{

    protected $table = 'opening_stock_detail';
    protected $primaryKey = 'opening_stock_detail_id';
    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = [
        "opening_stock_id",
        "opening_stock_detail_id",
        "sort_order",
        "product_type_id",
        "product_id",
        "product_name",
        "product_description",
        "description",
        "warehouse_id",
        "unit_id",
        "document_currency_id",
        "base_currency_id",
        "unit_conversion",
        "currency_conversion",
        "quantity",
        "rate",
        "amount",
        "created_by",
        "updated_by"
    ];
    protected $casts = [
        'quantity' => 'float',
        'rate' => 'float',
        'amount' => 'float',
    ];

    public function opening_stock()
    {
        return $this->belongsTo(OpeningStock::class, 'opening_stock_id')->select('*');
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'warehouse_id')->select('*');
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id')->select('*', DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function product_type()
    {
        return $this->belongsTo(ProductType::class, 'product_type_id', 'product_type_id')->select('*');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'unit_id')->select('*');
    }
}
