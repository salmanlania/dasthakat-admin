<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Terms extends Model
{
    protected $table = 'terms';
    protected $primaryKey = 'term_id'; 
    public $incrementing = false; 
    protected $fillable = [
        'company_id','company_branch_id','term_id','name','created_by','updated_by'
    ];
}