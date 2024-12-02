<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false;

    // protected $connection = 'mysql';
    protected $table = 'product_categories';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
            'id',
           'name',
           'is_deleted',
	       'created_by'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
