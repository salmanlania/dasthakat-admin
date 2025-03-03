<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class JobOrder extends Model
{

    protected $table = 'job_order';
    protected $primaryKey = 'job_order_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "job_order_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "customer_id",
        "salesman_id",
        "event_id",
        "vessel_id",
        "flag_id",
        "class1_id",
        "class2_id",
        "agent_id",
        "created_by",
        "updated_by"
    ];


    public function job_order_detail()
    {
        return $this->hasMany(JobOrderDetail::class, 'job_order_detail_id', 'job_order_detail_id')->orderBy('sort_order');
    }
    public function salesman()
    {
        return $this->hasOne(Salesman::class, 'salesman_id', 'salesman_id')->select('salesman_id', 'name');
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
    public function vessel()
    {
        return $this->hasOne(Vessel::class, 'vessel_id', 'vessel_id')->select('vessel_id', 'name');
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
    public function agent()
    {
        return $this->hasOne(Agent::class, 'agent_id', 'agent_id')->select('agent_id', 'name');
    }
}
