<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    protected $table = 'sub_category';
    protected $primaryKey = 'sub_category_id'; 
    protected $keyType = 'string';
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','sub_category_id','category_id','name','created_by','updated_by'
    ];
}