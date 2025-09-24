<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorPayment extends Model
{
    protected $table = 'vendor_payment';
    protected $primaryKey = 'vendor_payment_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'company_id',
        'company_branch_id',
        'vendor_payment_id',
        'document_type_id',
        'document_prefix',
        'document_no',
        'document_identity',
        'document_date',
        'supplier_id',
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
        return $this->hasMany(VendorPaymentDetail::class, 'vendor_payment_id', 'vendor_payment_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
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
