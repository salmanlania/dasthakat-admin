<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PicklistDetail extends Model
{

    protected $table = 'picklist_detail';
    protected $primaryKey = 'picklist_detail_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "picklist_id",
        "picklist_detail_id",
        "sort_order",
        "charge_order_detail_id",
        "product_id",
        "product_description",
        "quantity",
        "created_by",
        "updated_by"
    ];
    protected $casts = [
        'quantity' => 'float',
    ];

    public function charge_order_detail()
    {
        return $this->belongsTo(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id')->select('*');
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id')->select('*');
    }
   
}
