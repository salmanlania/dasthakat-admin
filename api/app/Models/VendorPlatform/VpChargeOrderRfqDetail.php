<?php

namespace App\Models\VendorPlatform;

use App\Models\Product;
use App\Models\ProductType;
use App\Models\ChargeOrderDetail;
use App\Models\Unit;
use App\Models\VendorChargeOrderDetail;
use Illuminate\Database\Eloquent\Model;

class VpChargeOrderRfqDetail extends Model  
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vp_charge_order_rfq_detail';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'detail_id';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'detail_id',
        'id',
        'charge_order_detail_id',
        'product_id',
        'product_name',
        'product_description',
        'product_type_id',
        'unit_id',
        'sort_order',
        'quantity',
        'vendor_rate',
        'vendor_part_no',
        'vendor_notes',
        'vendor_charge_order_detail_id',
        'created_by',
        'updated_by'
    ];


    //relationships
    
    public function charge_order_detail()
    {
        return $this->belongsTo(ChargeOrderDetail::class, 'charge_order_detail_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
    public function product_type()
    {
        return $this->belongsTo(ProductType::class, 'product_type_id', 'product_type_id');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'unit_id');
    }

   

    public function vendor_charge_order_detail()
    {
        return $this->belongsTo(VendorChargeOrderDetail::class, 'vendor_charge_order_detail_id', 'vendor_charge_order_detail_id');
    }
}
