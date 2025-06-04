<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class StockReturn extends Model
{

    protected $table = 'stock_return';
    protected $primaryKey = 'stock_return_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "stock_return_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "ship_via",
        "ship_to",
        "return_date",
        "charge_order_id",
        "picklist_id",
        "total_quantity",
        "total_amount",
        "status",
        "created_by",
        "updated_by"
    ];

    public function stock_return_detail()
    {
        return $this->hasMany(StockReturnDetail::class, 'stock_return_id', 'stock_return_id')->orderBy('sort_order');
    }


    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id')->select('*');
    }

    public function picklist()
    {
        return $this->hasOne(Picklist::class, 'picklist_id', 'picklist_id')->select('*');
    }
    public function created_by_user()
    {
        return $this->hasOne(User::class, 'user_id', 'created_by')->select('user_id', 'user_name','email');
    }
    public function updated_by_user()
    {
        return $this->hasOne(User::class, 'user_id', 'updated_by')->select('user_id', 'user_name','email');
    }
}
