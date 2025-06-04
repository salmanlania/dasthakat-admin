<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vessel extends Model
{
    protected $table = 'vessel';
    protected $primaryKey = 'vessel_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','vessel_id','customer_id','block_status','imo','name','flag_id','class1_id','class2_id','billing_address','created_by','updated_by'
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
    
    public function flag()
    {
        return $this->hasOne(Flag::class, 'flag_id', 'flag_id')->select('*');
    }
}