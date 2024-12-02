<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false;

    // protected $connection = 'mysql';
    protected $table = 'favourites';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
		'product_id',
		'created_by'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
