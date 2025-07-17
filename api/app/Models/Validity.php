<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Validity extends Model
{
    protected $table = 'validity';
    protected $primaryKey = 'validity_id'; 
    public $incrementing = false; 
    protected $keyType = 'string';

    protected $fillable = [
       'company_id','company_branch_id', 'validity_id','name','created_by','updated_by'
    ];
}