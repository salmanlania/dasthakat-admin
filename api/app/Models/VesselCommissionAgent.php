<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VesselCommissionAgent extends Model
{
    protected $table = 'vessel_commission_agent';
    protected $primaryKey = 'vessel_commission_agent_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'vessel_commission_agent_id',
        'vessel_id',
        'commission_agent_type',
        'commission_percentage', 
        'commission_agent_id',
        'status',
        'created_by',
        'updated_by'
    ];

    public function vessel()
    {
        return $this->belongsTo(Vessel::class, 'vessel_id', 'vessel_id');
    }

    public function commissionAgent()
    {
        return $this->belongsTo(CommissionAgent::class, 'commission_agent_id', 'commission_agent_id');
    }
}