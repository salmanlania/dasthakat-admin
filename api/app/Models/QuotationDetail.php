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
        // "product_code",
        "product_id",
        "product_type_id",
        "product_name",
        "product_description",
        "description",
        "unit_id",
        "supplier_id",
        "vendor_part_no",
        "internal_notes",
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
    
    protected $casts = [
        'quantity' => 'float',
        'cost_price' => 'float',
        'markup' => 'float',
        'rate' => 'float',
        'amount' => 'float',
        'discount_amount' => 'float',
        'discount_percent' => 'float',
        'gross_amount' => 'float',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id','product_id')->select('*',DB::raw("CONCAT(impa_code, ' ', name) as product_name"));
    }
    public function product_type()
    {
        return $this->belongsTo(ProductType::class, 'product_type_id','product_type_id')->select('*');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id','unit_id')->select('*');
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id','supplier_id')->select('*');
    }
}
