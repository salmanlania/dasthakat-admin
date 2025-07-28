<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'company';
    public $incrementing = false; 
    protected $keyType = 'string';

    protected $primaryKey = 'company_id'; 
    protected $fillable = [
        'company_id','name','address','base_currency_id','is_exempted','created_by','updated_by'
    ];
    public function branches() {
        return $this->hasMany(CompanyBranch::class, 'company_id', 'company_id');
    }
   
}