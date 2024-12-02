<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attributes extends Model 
{
    protected $primaryKey = 'id'; 
    protected $table = 'attributes';
  

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
