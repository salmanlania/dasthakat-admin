<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParlourModule extends Model 
{
    

    protected $primaryKey = 'id'; 

    // protected $connection = 'mysql';
    protected $table = 'parlour_module';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
	    'name'
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
