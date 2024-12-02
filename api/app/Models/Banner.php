<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Banner extends Model 
{
    protected $primaryKey = 'id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'banners';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
	    'image',
	    'path',
	    'type'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
