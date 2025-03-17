<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventDispatch extends Model
{
    protected $table = 'event_dispatch';
    protected $primaryKey = 'event_dispatch_id';
    public $incrementing = false;
    protected $fillable = [
        'company_id',
        'company_branch_id',
        'event_dispatch_id',
        'event_date',
        'event_id',
        'technician_id',
        'technician_notes',
        'agent_id',
        'agent_notes',
        'created_by',
        'updated_by'
    ];

    public function event()
    {
        return $this->hasOne(Event::class, 'event_id', 'event_id')->select('*');
    }
    public function vessel()
    {
        return $this->hasOne(Vessel::class, 'vessel_id', 'vessel_id')->select('*');
    }
    public function agent()
    {
        return $this->hasOne(Agent::class, 'agent_id', 'agent_id')->select('*');
    }
    public function technician()
    {
        return $this->hasOne(Technician::class, 'technician_id', 'technician_id')->select('*');
    }
}
