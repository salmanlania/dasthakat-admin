<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $table = 'brand';
    protected $primaryKey = 'brand_id'; 
    protected $keyType = 'string';
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','brand_id','name','created_by','updated_by'
    ];
}