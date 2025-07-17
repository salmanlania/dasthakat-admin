<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;


class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    protected $primaryKey = 'user_id'; 
    public $incrementing = false; 
    protected $keyType = 'string';

    // protected $connection = 'mysql';
    protected $table = 'user';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'company_id',
        'user_id',
        'permission_id',
        'password',
        'api_token',
        'user_name',
        'user_type',
        'phone_no',
        'email',
        'image',
        'status',
        'from_time',
        'to_time',
        'is_exempted',
        'otp',
        'last_login',
        'created_by',
        'updated_by',
        'otp_created_at',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    protected $hidden = [
        'password',
    ];
    
    public function permission()
    {
        return $this->hasOne(UserPermission::class,'user_permission_id','permission_id');
    }
    // public function country()
    // {
    //     return $this->hasOne(Country::class,'id','country_id');
    // }
}
