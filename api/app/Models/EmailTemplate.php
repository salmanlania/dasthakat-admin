<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'settings';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
         'module',
         'field',
         'value'
    ];



    protected $modules = [
		'Create User'=>'Create User',
		'Update Password'=>'Update Password',
		'Forgot Password'=>'Forgot Password',
		'Create Quote Request'=>'Create Quote Request',
		'Update Quote Request'=>'Update Quote Request',
		'Order Creation'=>'Order Creation',
		'Order Cancellation'=>'Order Cancellation',
		'Order Shipped'=>'Order Shipped',
		'Chat Message'=>'Chat Message'
	];


	public function getModules()
	{
		return $this->modules;
	}


    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    
}
