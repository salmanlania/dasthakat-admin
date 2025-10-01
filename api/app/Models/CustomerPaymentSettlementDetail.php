<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerPaymentSettlementDetail extends Model
{
    protected $table = 'customer_payment_settlement_detail';
    protected $primaryKey = 'customer_payment_settlement_detail_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'customer_payment_settlement_id',
        'customer_payment_settlement_detail_id',
        'sort_order',
        'account_id',
        'amount',
        'remarks',
        'created_by',
        'updated_by',
    ];

    public function payment_settlement()
    {
        return $this->belongsTo(CustomerPaymentSettlement::class, 'customer_payment_settlement_id', 'customer_payment_settlement_id');
    }

    public function customer_payment()
    {
        return $this->belongsTo(CustomerPayment::class, 'customer_payment_id', 'customer_payment_id');
    }
    
    public function account()
    {
        return $this->belongsTo(Accounts::class, 'account_id', 'account_id');
    }
    
}
