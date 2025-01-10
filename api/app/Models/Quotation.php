<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Quotation extends Model
{

    protected $table = 'quotation';
    protected $primaryKey = 'quotation_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "quotation_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "service_date",
        "salesman_id",
        "customer_id",
        "person_incharge_id",
        "event_id",
        "event_status",
        "vessel_id",
        "flag_id",
        "class1_id",
        "class2_id",
        "customer_ref",
        "due_date",
        "attn",
        "delivery",
        "validity_id",
        "payment_id",
        "internal_notes",
        "port_id",
        "term_id",
        "term_desc",
        "total_quantity",
        "total_amount",
        "total_discount",
        "net_amount",
        "rebate_percent",
        "rebate_amount",
        "salesman_percent",
        "salesman_amount",
        "final_amount",
        "created_by",
        "updated_by"
    ];

    public function quotation_detail()
    {
        return $this->hasMany(QuotationDetail::class, 'quotation_id', 'quotation_id')->orderBy('sort_order');
    }
    public function salesman()
    {
        return $this->hasOne(Salesman::class, 'salesman_id', 'salesman_id')->select('salesman_id', 'name');
    }

    public function vessel()
    {
        return $this->hasOne(Vessel::class, 'vessel_id', 'vessel_id')->select('*');
    }
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
    public function customer()
    {
        return $this->hasOne(Customer::class, 'customer_id', 'customer_id')->select('customer_id', 'name');
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
    public function validity()
    {
        return $this->hasOne(Validity::class, 'validity_id', 'validity_id')->select('validity_id', 'name');
    }
    public function payment()
    {
        return $this->hasOne(Payment::class, 'payment_id', 'payment_id')->select('payment_id', 'name');
    }
    public function port()
    {
        return $this->hasOne(Port::class, 'port_id', 'port_id')->select('port_id', 'name');
    }
    public function person_incharge()
    {
        return $this->hasOne(User::class, 'user_id', 'person_incharge_id')->select('user_id', 'user_name');
    }
}
