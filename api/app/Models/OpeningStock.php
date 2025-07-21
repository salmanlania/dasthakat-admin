<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OpeningStock extends Model
{

    protected $table = 'opening_stock';
    protected $primaryKey = 'opening_stock_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "opening_stock_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "remarks",
        "total_quantity",
        "total_amount",
        "created_by",
        "updated_by"
    ];
    protected $casts = [
        'total_quantity' => 'float',
        'total_amount' => 'float',
    ];
    public function opening_stock_detail()
    {
        return $this->hasMany(OpeningStockDetail::class, 'opening_stock_id', 'opening_stock_id')->orderBy('sort_order');
    }

}
