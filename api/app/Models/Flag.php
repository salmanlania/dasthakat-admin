<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flag extends Model
{
    protected $table = 'flag';
    protected $primaryKey = 'flag_id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'company_id',
        'company_branch_id',
        'flag_id',
        'name',
        'created_by',
        'updated_by'
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
}
