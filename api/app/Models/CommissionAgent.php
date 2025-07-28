<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommissionAgent extends Model
{
    protected $table = 'commission_agent';
    protected $primaryKey = 'commission_agent_id'; 
    protected $keyType = 'string';
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','commission_agent_id','name','address','phone','created_by','updated_by'
    ];
}