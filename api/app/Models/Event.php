<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'event';
    protected $primaryKey = 'event_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','event_id','event_no','event_code','customer_id','vessel_id','class1_id','class2_id','status','created_by','updated_by'
    ];
    
}