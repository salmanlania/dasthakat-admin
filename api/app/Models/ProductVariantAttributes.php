<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariantAttributes extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false;
    // protected $connection = 'mysql';
    protected $table = 'product_variant_attributes';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
	    'product_id',
        'variant_id',
	    'attribute_id',
	    'attribute_name',
        'attribute_value'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
