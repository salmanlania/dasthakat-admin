<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PicklistReceivedDetail extends Model
{

    protected $table = 'picklist_received_detail';
    protected $primaryKey = 'picklist_received_detail_id';
    public $incrementing = false;

    protected $fillable = [
        "picklist_received_id",
        "picklist_received_detail_id",
        "sort_order",
        "picklist_detail_id",
        "remarks",
        "product_id",
        "quantity",
        "created_by",
        "updated_by"
    ];
    public function picklist_detail()
    {
        return $this->hasOne(PicklistDetail::class, 'picklist_detail_id', 'picklist_detail_id');
    }
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id', 'product_id');
    }
   
   
}
