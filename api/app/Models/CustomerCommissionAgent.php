<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerCommissionAgent extends Model
{
    protected $table = 'customer_commission_agent';
    protected $primaryKey = 'customer_commission_agent_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'customer_commission_agent_id',
        'customer_id',
        'commission_agent_type',
        'commission_percentage', 
        'commission_agent_id',
        'status',
        'created_by',
        'updated_by'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function commission_agent()
    {
        return $this->belongsTo(CommissionAgent::class, 'commission_agent_id', 'commission_agent_id');
    }
}