<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'category';
    protected $primaryKey = 'category_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','category_id','name','created_by','updated_by'
    ];
}