<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyBranch extends Model
{
    protected $table = 'company_branch';
    protected $primaryKey = 'company_branch_id'; 
    public $incrementing = false; 

    protected $fillable = [
        'company_branch_id','company_id','branch_code','name','phone_no','address','created_by','updated_by'
    ];
}