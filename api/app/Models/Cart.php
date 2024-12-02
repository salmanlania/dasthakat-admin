<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false;

    // protected $connection = 'mysql';
    protected $table = 'product_cart';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
		'product_id',
        'variant_id',
        'quantity',
        'price',
        'amount',
		'created_by'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
