<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salesman extends Model
{
    protected $table = 'salesman';
    protected $primaryKey = 'salesman_id'; 
    protected $keyType = 'string';
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','salesman_id','name','commission_percentage','created_by','updated_by'
    ];
}