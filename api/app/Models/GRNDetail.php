<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class GRNDetail extends Model
{

    protected $table = 'good_received_note_detail';
    protected $primaryKey = 'good_received_note_detail_id';
    public $incrementing = false;


    protected $fillable = [
        "good_received_note_id",
        "good_received_note_detail_id",
        "purchase_order_detail_id",
        "sort_order",
        "product_type_id",
        "product_id",
        "product_name",
        "description",
        "warehouse_id",
        "unit_id",
        "quantity",
        "rate",
        "amount",
        "vendor_notes",
        "created_by",
        "updated_by"
    ];
    public function grn()
    {
        return $this->belongsTo(GRN::class, 'good_received_note_id');
    }
    public function warehouse()
    {
        return $this->hasOne(Warehouse::class, 'warehouse_id', 'warehouse_id');
    }
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id','product_id')->select('*',DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function product_type()
    {
        return $this->hasOne(ProductType::class, 'product_type_id', 'product_type_id');
    }
    public function unit()
    {
        return $this->hasOne(Unit::class, 'unit_id', 'unit_id');
    }
  
}
