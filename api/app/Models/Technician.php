<?php
// Not in use

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Technician extends Model
{
    protected $table = 'technician';
    protected $primaryKey = 'technician_id'; 
    public $incrementing = false; 
    protected $keyType = 'string';

    protected $fillable = [
        'company_id','company_branch_id','technician_id','name','created_by','updated_by'
    ];
}