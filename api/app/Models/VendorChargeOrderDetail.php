<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorChargeOrderDetail extends Model
{
    protected $table = 'vendor_charge_order_detail';
    protected $primaryKey = 'vendor_charge_order_detail_id';
    public $incrementing = false;
    protected $keyType = 'string';

    
    protected $fillable = [
        'company_id', 
        'company_branch_id', 
        'vendor_charge_order_detail_id', 
        'charge_order_id', 
        'charge_order_detail_id', 
        'vendor_id', 
        'sort_order', 
        'vendor_rate', 
        'is_primary_vendor', 
        'vendor_part_no',
        'vendor_notes',
        'created_by', 
        'updated_by'
    ];


    public function charge_order_detail()
    {
        return $this->belongsTo(ChargeOrderDetail::class, 'charge_order_detail_id', 'charge_order_detail_id');
    }
    public function vendor()
    {
        return $this->belongsTo(Supplier::class, 'vendor_id', 'supplier_id');
    }
}
