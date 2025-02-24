<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vessel extends Model
{
    protected $table = 'vessel';
    protected $primaryKey = 'vessel_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','vessel_id','customer_id','imo','name','flag_id','class1_id','class2_id','billing_address','created_by','updated_by'
    ];
    
}