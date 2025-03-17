<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Technician extends Model
{
    protected $table = 'technician';
    protected $primaryKey = 'technician_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','technician_id','name','created_by','updated_by'
    ];
}