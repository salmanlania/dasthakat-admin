<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Supplier extends Model 
{

    protected $primaryKey = 'supplier_id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'supplier';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'company_id',
        'company_branch_id',
        'supplier_id',
        'name',
        'supplier_code',
        'payment_id',
        'location',
        'contact_person',
        'contact1',
        'contact2',
        'email',
        'address',
        'status',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    public function payment()
    {
        return $this->hasOne(Payment::class, 'payment_id','payment_id')->select('*');
    }
    
}
