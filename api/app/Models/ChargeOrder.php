<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ChargeOrder extends Model
{

    protected $table = 'charge_order';
    protected $primaryKey = 'charge_order_id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'technician_id' => 'array',
        'total_quantity' => 'float',
        'total_amount' => 'float',
        'total_discount' => 'float',
        'net_amount' => 'float',
    ];

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "charge_order_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "ref_document_type_id",
        "ref_document_identity",
        "document_date",
        "salesman_id",
        "customer_po_no",
        "customer_id",
        "event_id",
        "vessel_id",
        "flag_id",
        "class1_id",
        "class2_id",
        "port_id",
        "agent_id",
        "agent_notes",
        "technician_id", // user_id used in technician_id
        "technician_notes",
        "remarks",
        "total_quantity",
        "total_amount",
        "total_discount",
        "net_amount",
        "is_deleted",
        "created_by",
        "updated_by"
    ];

    public function charge_order_detail()
    {
        return $this->hasMany(ChargeOrderDetail::class, 'charge_order_id', 'charge_order_id')->orderBy('sort_order');
    }
    public function shipmentDetail()
    {
        return $this->hasMany(ShipmentDetail::class, 'charge_order_id', 'charge_order_id')->orderBy('sort_order');
    }
    public function quotation()
    {
        return $this->hasOne(Quotation::class, 'document_identity', 'ref_document_identity');
    }
    public function service_order()
    {
        return $this->hasOne(ServiceOrder::class, 'charge_order_id', 'charge_order_id');
    }
    public function picklists()
    {
        return $this->hasMany(Picklist::class, 'charge_order_id', 'charge_order_id')->orderBy('document_date');
    }
    public function salesman()
    {
        return $this->hasOne(Salesman::class, 'salesman_id', 'salesman_id')->select('salesman_id', 'name');
    }
    // public function event()
    // {
    //     return $this->hasOne(Event::class, 'event_id', 'event_id')
    //         ->join('vessel', 'vessel.vessel_id', '=', 'event.vessel_id')
    //         ->select(
    //             'event.event_id',
    //             'event.event_code',
    //             DB::raw("CONCAT(event.event_code, ' (', COALESCE(vessel.name, 'Unknown'), ')') as event_name")
    //         );
    // }
    public function event()
    {
        return $this->hasOne(Event::class, 'event_id', 'event_id')
            ->join('vessel', 'vessel.vessel_id', '=', 'event.vessel_id')
            ->select(
                'event.event_id',
                'event.event_code',
                DB::raw("CONCAT(event.event_code, ' (', COALESCE(vessel.name, 'Unknown'), ')') as event_name")
            );
    }
    public function vessel()
    {
        return $this->hasOne(Vessel::class, 'vessel_id', 'vessel_id')->select('*');
    }
    public function customer()
    {
        return $this->hasOne(Customer::class, 'customer_id', 'customer_id')->select('*');
    }
    public function flag()
    {
        return $this->hasOne(Flag::class, 'flag_id', 'flag_id')->select('flag_id', 'name');
    }
    public function class1()
    {
        return $this->hasOne(SetupClass::class, 'class_id', 'class1_id')->select('class_id', 'name');
    }
    public function class2()
    {
        return $this->hasOne(SetupClass::class, 'class_id', 'class2_id')->select('class_id', 'name');
    }
    public function agent()
    {
        return $this->hasOne(Agent::class, 'agent_id', 'agent_id')->select('*');
    }
    public function port()
    {
        return $this->hasOne(Port::class, 'port_id', 'port_id')->select('port_id', 'name');
    }
}
