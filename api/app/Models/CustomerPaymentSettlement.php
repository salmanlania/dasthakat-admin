<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerPaymentSettlement extends Model
{
    protected $table = 'customer_payment_settlement';
    protected $primaryKey = 'customer_payment_settlement_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'company_id',
        'company_branch_id',
        'customer_payment_settlement_id',
        'document_type_id',
        'document_prefix',
        'document_no',
        'document_identity',
        'document_date',
        'customer_id',
        'base_currency_id',
        'document_currency_id',
        'transaction_account_id',
        'conversion_rate',
        'total_amount',
        'remarks',
        'created_by',
        'updated_by',
    ];

    public function details()
    {
        return $this->hasMany(CustomerPaymentSettlementDetail::class, 'customer_payment_settlement_id', 'customer_payment_settlement_id')->orderBy('sort_order');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }
    public function transaction_account()
    {
        return $this->belongsTo(Accounts::class, 'transaction_account_id', 'account_id');
    }
    
    public function document_currency()
    {
        return $this->belongsTo(Currency::class, 'document_currency_id', 'currency_id');
    }

    public function base_currency()
    {
        return $this->belongsTo(Currency::class, 'base_currency_id', 'currency_id');
    }
}
