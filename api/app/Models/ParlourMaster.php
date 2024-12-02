<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ParlourMaster extends Model 
{
    protected $primaryKey = 'id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'parlour_master';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
	'name',
	'module_id',
	'is_deleted'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    
    public function parlour_module()
    {
        return $this->hasOne(ParlourModule::class,'id','module_id');
    }
}
