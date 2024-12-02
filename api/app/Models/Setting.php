<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model 
{
    

    protected $primaryKey = 'id'; 

     // protected $connection = 'mysql';
      public $incrementing = false; 
    protected $table = 'setting';
    
    
    protected $mailKeys = [
        'order_conformation' => ["title"=>"Order Conformation","tags"=>["<Name>","<botton>","<link>"]],
	'order_cancellation' => ["title"=>"Order Cancellation","tags"=>["<Name>","<botton>","<link>"]],
	'forgot_password' => ["title"=>"Forgot Password","tags"=>["<Name>","<botton>","<link>"]],
    ];
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
	'module',
        'field',
        'value',
        'created_at'
    ];
    
    
    public function getEmailKeys()
    {
		return $this->mailKeys;
    }


    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    
}
