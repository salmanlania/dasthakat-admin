<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceOrder extends Model
{
    protected $table = 'service_order';
    protected $primaryKey = 'service_order_id';
    public $incrementing = false;
    protected $fillable = [
        'company_id',
        'company_branch_id',
        'service_order_id',
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "event_id",
        'charge_order_id',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by'
    ];
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id')->select('*');
    }
    public function service_order_detail()
    {
        return $this->hasMany(ServiceOrderDetail::class, 'service_order_id', 'service_order_id')->orderBy('sort_order')->select('*');
    }
    public function scheduling()
    {
        return $this->hasOne(EventDispatch::class, 'event_id', 'event_id')->select('*');
    }
    public function event()
    {
        return $this->hasOne(Event::class, 'event_id', 'event_id')->select('*');
    }
}
