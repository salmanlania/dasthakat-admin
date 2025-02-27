<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class JobOrderDetail extends Model
{

    protected $table = 'job_order';
    protected $primaryKey = 'job_order_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "job_order_id",
        "job_order_detail_id",
        "charge_order_id",
        "charge_order_detail_id",
        "quantity",
        "created_by",
        "updated_by"
    ];
  
    public function charge_order_detail()
    {
        return $this->hasOne(ChargeOrderDetail::class, 'charge_order_detail_id','charge_order_detail_id')->select('*');
    }
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id','charge_order_id')->select('*');
    }
    public function job_order()
    {
        return $this->hasOne(JobOrder::class, 'job_order_id','job_order_id')->select('*');
    }
}
