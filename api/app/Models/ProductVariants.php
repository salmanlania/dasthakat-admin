<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariants extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false;

    // protected $connection = 'mysql';
    protected $table = 'product_variants';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
            'id',
           'product_id',
           'part_number',
           'price',
           'voltage',
           'bend',
           'type',
           'stroke',
	   'sort_order',
	   'created_by'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
