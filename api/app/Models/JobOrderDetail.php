<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class JobOrderDetail extends Model
{

    protected $table = 'job_order_detail';
    protected $primaryKey = 'job_order_detail_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "job_order_id",
        "job_order_detail_id",
        "charge_order_id",
        "charge_order_detail_id",
        "sort_order",
        "product_id",
        "description",
        "product_name",
        "product_description",
        "product_type_id",
        "internal_notes",
        "status",
        "unit_id",
        "supplier_id",
        "quantity",
        "created_by",
        "updated_by"
    ];

    public function charge_order_detail()
    {
        return $this->hasOne(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id')->select('*');
    }
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id')->select('*');
    }
    public function job_order()
    {
        return $this->hasOne(JobOrder::class, 'job_order_id', 'job_order_id')->select('*');
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
