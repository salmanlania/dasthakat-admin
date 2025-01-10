<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $table = 'unit';
    protected $primaryKey = 'unit_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','unit_id','name','created_by','updated_by'
    ];
}