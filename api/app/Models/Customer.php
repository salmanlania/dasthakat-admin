<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;


class Customer extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    protected $primaryKey = 'customer_id';
    protected $keyType = 'string';
    public $incrementing = false;

    // protected $connection = 'mysql';
    protected $table = 'customer';


    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'company_id',
        'company_branch_id',
        'customer_id',
        'name',
        'customer_code',
        'salesman_id',
        'country',
        'address',
        'billing_address',
        'phone_no',
        'block_status',
        'email_sales',
        'email_accounting',
        'vessel_id',
        'payment_id',
        'rebate_percent',
        'outstanding_account_id',
        'status',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */

    public function pivot_vessel()
    {
        return $this->belongsToMany(Vessel::class, 'customer_vessel', 'customer_id', 'vessel_id')
            ->select('vessel.vessel_id', 'vessel.name');
    }
    public function payment()
    {
        return $this->hasOne(Payment::class, 'payment_id', 'payment_id')->select('payment_id', 'name');
    }
    public function customer_commission_agent()
    {
        return $this->hasMany(CustomerCommissionAgent::class, 'customer_id', 'customer_id')->select('*');
    }
    public function salesman()
    {
        return $this->hasOne(Salesman::class, 'salesman_id', 'salesman_id')->select('salesman_id', 'name');
    }
    public function outstanding_account()
    {
        return $this->hasOne(Accounts::class, 'account_id', 'outstanding_account_id')->select('*');
    }
}
