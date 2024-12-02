<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'orders';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
        'order_no',
	'document_no',
        'order_date',
	'first_name',
	'last_name',
	'full_name',
	'organization',
	'country_id',
	'phone_no',
	'postal_code',
	'address',
	'total_amount',
        'is_deleted',
	'remarks',
        'created_by',
	'created_by'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
     
     public function order_detail()
    {
        return $this->hasMany(OrderDetail::class,'order_id')->orderBy('sort_order');
    }
    
}
