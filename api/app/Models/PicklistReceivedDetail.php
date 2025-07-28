<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PicklistReceivedDetail extends Model
{

    protected $table = 'picklist_received_detail';
    protected $primaryKey = 'picklist_received_detail_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "picklist_received_id",
        "picklist_received_detail_id",
        "sort_order",
        "picklist_detail_id",
        "charge_order_detail_id",
        "remarks",
        "product_id",
        "quantity",
        "created_by",
        "updated_by"
    ];
    protected $casts = [
        'quantity' => 'float',
    ];

    public function picklist_detail()
    {
        return $this->belongsTo(PicklistDetail::class, 'picklist_detail_id', 'picklist_detail_id')->select('*');
    }
    public function charge_order_detail()
    {
        return $this->belongsTo(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id')->select('*');
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id')->select('*');
    }
    public function pulled_by()
    {
        return $this->belongsTo(User::class, 'user_id', 'created_by')->select('user_id', 'user_name','email')->select('*');
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'warehouse_id')->select('*');
    }
   
   
}
