<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Port extends Model
{
    protected $table = 'port';
    protected $primaryKey = 'port_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','port_id','name','created_by','updated_by'
    ];
}