<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductType extends Model
{


    protected $table = 'product_type';
    protected $primaryKey = 'product_type_id';
    protected $updated_at = false;

    protected $fillable = [
        'product_type_id',
        'name',
        'created_by',
    ];

}
