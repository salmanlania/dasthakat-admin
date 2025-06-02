<?php
// Dispatch renamed as Scheduling	

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventDispatch extends Model
{
    protected $table = 'event_dispatch';
    protected $primaryKey = 'event_dispatch_id';
    public $incrementing = false;
    protected $casts = [
        'technician_id' => 'array',
    ];

    protected $fillable = [
        'company_id',
        'company_branch_id',
        'event_dispatch_id',
        'event_date',
        'event_time',
        'event_id',
        'technician_id',
        'technician_notes',
        'port_id',
        'agent_id',
        'agent_notes',
        'status',
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
    public function port()
    {
        return $this->hasOne(Port::class, 'port_id', 'port_id')->select('*');
    }
}
