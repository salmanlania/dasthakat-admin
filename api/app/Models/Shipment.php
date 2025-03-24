<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    protected $table = 'shipment';
    protected $primaryKey = 'shipment_id';
    public $incrementing = false;
    protected $fillable = [
        'company_id',
        'company_branch_id',
        'shipment_id',
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        'event_id',
        'charge_order_id',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by'
    ];
    public function event()
    {
        return $this->hasOne(Event::class, 'event_id', 'event_id')->select('*');
    }
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id')->select('*');
    }
    public function shipment_detail()
    {
        return $this->hasMany(ShipmentDetail::class, 'shipment_id', 'shipment_id')->select('*');
    }
}
