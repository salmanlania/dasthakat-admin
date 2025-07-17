<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'event';
    protected $primaryKey = 'event_id'; 
    protected $keyType = 'string';
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','event_id','event_no','event_code','customer_id','vessel_id','class1_id','class2_id','status','created_by','updated_by'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }
    public function company_branch()
    {
        return $this->belongsTo(CompanyBranch::class, 'company_branch_id', 'company_branch_id');
    }
    public function created_user()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id')->select('user_id', 'email', 'user_name');
    }
    public function updated_user()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id')->select('user_id', 'email', 'user_name');
    }


    public function customer()
    {
        return $this->hasOne(Customer::class, 'customer_id','customer_id')->select('*');
    }
    public function vessel()
    {
        return $this->hasOne(Vessel::class, 'vessel_id','vessel_id')->select('*');
    }
    public function class1()
    {
        return $this->hasOne(SetupClass::class, 'class_id', 'class1_id')->select('*');
    }
    public function class2()
    {
        return $this->hasOne(SetupClass::class, 'class_id', 'class2_id')->select('*');
    }
}