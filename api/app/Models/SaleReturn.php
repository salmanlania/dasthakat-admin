<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class SaleReturn extends Model
{

    protected $table = 'sale_return';
    protected $primaryKey = 'sale_return_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "sale_return_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "charge_order_id",
        "picklist_id",
        "total_quantity",
        "total_amount",
        "created_by",
        "updated_by"
    ];
  
    public function sale_return_detail()
    {
        return $this->hasMany(SaleReturnDetail::class, 'sale_return_id','sale_return_id')->orderBy('sort_order');
    }
   
   
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id','charge_order_id')->select('*');
    }

    public function picklist()
    {
        return $this->hasOne(Picklist::class, 'picklist_id','picklist_id')->select('*');
    }
   
}
