<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerPayment extends Model
{
    protected $table = 'customer_payment';
    protected $primaryKey = 'customer_payment_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'company_id',
        'company_branch_id',
        'customer_payment_id',
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
        'payment_amount',
        'total_amount',
        'remarks',
        'created_by',
        'updated_by',
    ];

    public function details()
    {
        return $this->hasMany(CustomerPaymentDetail::class, 'customer_payment_id', 'customer_payment_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }
}
