<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false;

    // protected $connection = 'mysql';
    protected $table = 'products';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
            'id',
	    'product_category_id',
           'name',
	    'summary',
	   'description',
	   'label_tags',
           'schedule_date',
           'schedule_time',
           'status',
	   'is_published',
	   'created_by',
	   'updated_by'
    ];
    
    
    public function images()
    {
        return $this->hasMany(ProductImage::class,'product_id')->orderBy('sort_order');
    }
    
    public function variants()
    {
        return $this->hasMany(ProductVariants::class,'product_id')->orderBy('sort_order');
    }
    

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
