<?php

namespace App\Models;

use Aws\Api\Service;
use Illuminate\Database\Eloquent\Model;

class ServicelistReceivedDetail extends Model
{

    protected $table = 'servicelist_received_detail';
    protected $primaryKey = 'servicelist_received_detail_id';
    public $incrementing = false;

    protected $fillable = [
        "servicelist_received_id",
        "servicelist_received_detail_id",
        "sort_order",
        "servicelist_detail_id",
        "remarks",
        "product_id",
        "quantity",
        "created_by",
        "updated_by"
    ];
    public function servicelist_detail()
    {
        return $this->hasOne(ServicelistDetail::class, 'servicelist_detail_id', 'servicelist_detail_id');
    }
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id', 'product_id');
    }
    public function warehouse()
    {
        return $this->hasOne(Warehouse::class, 'warehouse_id', 'warehouse_id');
    }
   
   
}
