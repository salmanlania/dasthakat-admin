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
    public function customer()
    {
        return $this->hasOne(Customer::class, 'customer_id','customer_id')->select('customer_id', 'name');
    }
    public function vessel()
    {
        return $this->hasOne(Vessel::class, 'vessel_id','vessel_id')->select('vessel_id', 'name');
    }
    public function class1()
    {
        return $this->hasOne(SetupClass::class, 'class_id', 'class1_id')->select('class_id', 'name');
    }
    public function class2()
    {
        return $this->hasOne(SetupClass::class, 'class_id', 'class2_id')->select('class_id', 'name');
    }
}