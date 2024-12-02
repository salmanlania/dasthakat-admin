<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPermission extends Model
{
    // protected $connection = 'other_connection';
    protected $table = 'user_permission';
    protected $primaryKey = 'user_permission_id';
    public $incrementing = false;
    
    protected $fillable = ['*'];


}