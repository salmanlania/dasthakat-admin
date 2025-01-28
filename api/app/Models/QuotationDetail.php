<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class QuotationDetail extends Model
{

    protected $table = 'quotation_detail';
    protected $primaryKey = 'quotation_detail_id';
    public $incrementing = false;


    protected $fillable = [
        "quotation_id",
        "quotation_detail_id",
        "sort_order",
        "product_code",
        "product_id",
        "product_type_id",
        "product_name",
        "description",
        "unit_id",
        "supplier_id",
        "quantity",
        "cost_price",
        "markup",
        "rate",
        "amount",
        "discount_amount",
        "discount_percent",
        "gross_amount",
        "created_by",
        "updated_by"
    ];
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
