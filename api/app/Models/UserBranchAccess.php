<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserBranchAccess extends Model
{
    protected $table = 'user_branch_access';
    protected $fillable = [
        'user_branch_access_id',
        'user_id',
        'company_id',
        'company_branch_id',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by'
    ];
    public function company()
    {
        return $this->hasOne(Company::class, 'company_id', 'company_id');
    }
    public function company_branch()
    {
        return $this->hasOne(CompanyBranch::class, 'company_branch_id', 'company_branch_id');
    }
   
}
