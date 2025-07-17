<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $table = 'agent';
    protected $primaryKey = 'agent_id'; 
    protected $keyType = 'string';
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','agent_id','agent_code','name','address','city','state','zip_code','phone','office_no','fax','email','created_by','updated_by'
    ];
}