<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentVoucher extends Model
{
    use HasFactory;

    protected $table = 'payment_voucher';
    protected $primaryKey = 'payment_voucher_id';
    public $incrementing = false; // UUID (char 36)
    protected $keyType = 'string';
    public $timestamps = false; // we manage created_at / updated_at manually

    protected $fillable = [
        'company_id',
        'company_branch_id',
        'payment_voucher_id',
        'document_type_id',
        'document_prefix',
        'document_no',
        'document_identity',
        'document_date',
        'base_currency_id',
        'document_currency_id',
        'transaction_account_id',
        'conversion_rate',
        'total_amount',
        'net_amount',
        'remarks',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
    ];

    protected $casts = [
        'document_date'  => 'date',
        'total_amount'   => 'decimal:2',
        'net_amount'     => 'decimal:2',
    ];

    // Relationships
    public function details()
    {
        return $this->hasMany(PaymentVoucherDetail::class, 'payment_voucher_id', 'payment_voucher_id');
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
