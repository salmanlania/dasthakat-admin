<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'order_detail';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
        'order_id',
        'product_id',
        'variant_id',
	'price',
        'quantity',
        'amount',
        'status',
	'sort_order',
        'created_by',
	'created_by'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
     
    public function product()
    {
        return $this->hasOne(Product::class,'id','product_id');
    }
    
    public function variant()
    {
        return $this->hasOne(ProductVariants::class,'id','variant_id');
    }
}
