<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserBranchAccess extends Model
{
    protected $table = 'user_branch_access';
    
    public function company(){
    	 return $this->hasOne(Company::class,'company_id','company_id');
    }
    public function company_branch(){
    	 return $this->hasOne(CompanyBranch::class,'company_branch_id','company_branch_id');
    }
}