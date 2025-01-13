<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flag extends Model
{
    protected $table = 'flag';
    protected $primaryKey = 'flag_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','flag_id','name','created_by','updated_by'
    ];
}