<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class GRNDetail extends Model
{

    protected $table = 'good_received_note_detail';
    protected $primaryKey = 'good_received_note_detail_id';
    public $incrementing = false;


    protected $fillable = [
        "good_received_note_id",
        "good_received_note_detail_id",
        "sort_order",
        "product_id",
        "description",
        "unit_id",
        "quantity",
        "rate",
        "amount",
        "vendor_notes",
        "created_by",
        "updated_by"
    ];
    public function product()
    {
        return $this->hasOne(Product::class, 'product_id', 'product_id');
    }
    public function unit()
    {
        return $this->hasOne(Unit::class, 'unit_id', 'unit_id');
    }
  
}
