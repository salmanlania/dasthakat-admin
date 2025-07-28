<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{


    protected $table = 'product';
    protected $primaryKey = 'product_id';
    protected $keyType = 'string';
    public $incrementing = false;

    // protected $connection = 'mysql';
    protected $casts = [
        'cost_price' => 'float',
        'sale_price' => 'float',
    ];


    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'company_id',
        'company_branch_id',
        'product_type_id',
        'product_id',
        'product_no',
        'short_code',
        'product_code',
        'image',
        'name',
        'impa_code',
        'category_id',
        'sub_category_id',
        'brand_id',
        'unit_id',
        'cost_price',
        'sale_price',
        'status',
        'created_by',
        'updated_by'
    ];


    // public function images()
    // {
    //     return $this->hasMany(ProductImage::class, 'product_id')->orderBy('sort_order');
    // }

    public function category()
    {
        return $this->hasOne(Category::class, 'category_id', 'category_id');
    }
    public function product_type()
    {
        return $this->hasOne(ProductType::class, 'product_type_id', 'product_type_id');
    }
    public function sub_category()
    {
        return $this->hasOne(SubCategory::class, 'sub_category_id', 'sub_category_id');
    }
    public function unit()
    {
        return $this->hasOne(Unit::class, 'unit_id', 'unit_id');
    }


    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
}
