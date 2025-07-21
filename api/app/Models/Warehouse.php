<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $table = 'warehouse';
    protected $primaryKey = 'warehouse_id'; 
    public $incrementing = false; 
    protected $keyType = 'string';

    protected $fillable = [
        'company_id','company_branch_id','warehouse_id','name','created_by','updated_by'
    ];
}