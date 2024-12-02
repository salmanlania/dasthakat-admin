<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogHistory extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false; 
    // protected $connection = 'mysql';
    protected $table = 'log_history';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
	    'request_id',
	    'created_by_id',
	    'tab',
	    'screen',
	    'json'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
