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
        "charge_order_detail_id",
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
        "vendor_notes",
        "created_by",
        "updated_by"
    ];
    public function grn()
    {
        return $this->belongsTo(GRN::class, 'good_received_note_id')->select('*');
    }
    public function charge_order_detail()
    {
        return $this->belongsTo(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id')->select('*');
    }
    public function purchase_order_detail()
    {
        return $this->belongsTo(PurchaseOrderDetail::class, 'purchase_order_detail_id')->select('*');
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
