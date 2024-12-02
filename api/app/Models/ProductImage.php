<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false;

    // protected $connection = 'mysql';
    protected $table = 'product_images';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
            'id',
           'product_id',
           'image',
           'path',
	   'sort_order',
	   'created_by'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
