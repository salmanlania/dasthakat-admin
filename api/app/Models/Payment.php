<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payment';
    protected $primaryKey = 'payment_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','payment_id','name','created_by','updated_by'
    ];
}