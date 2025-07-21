<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicelistReceived extends Model
{

    protected $table = 'servicelist_received';
    protected $primaryKey = 'servicelist_received_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "servicelist_received_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "servicelist_id",
        "total_quantity",
        "charge_order_id",
        "created_by",
        "updated_by"
    ];
    protected $casts = [
        'total_quantity' => 'float',
    ];


    public function servicelist_received_detail()
    {
        return $this->hasMany(ServicelistReceivedDetail::class, 'servicelist_received_id', 'servicelist_received_id')->orderBy('sort_order');
    }
    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id');
    }

    public function servicelist()
    {
        return $this->hasOne(Servicelist::class, 'servicelist_id', 'servicelist_id');
    }
}
