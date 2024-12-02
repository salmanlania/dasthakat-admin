<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAttributes extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false;
    // protected $connection = 'mysql';
    protected $table = 'product_attributes';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
	    'product_id',
	    'attribute_id',
	    'attribute_name',
	     'sort_order',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
