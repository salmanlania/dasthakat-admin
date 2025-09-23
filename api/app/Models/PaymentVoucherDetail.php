<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentVoucherDetail extends Model
{
    use HasFactory;

    protected $table = 'payment_voucher_detail';
    protected $primaryKey = 'payment_voucher_detail_id';
    public $incrementing = false; // UUID
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'payment_voucher_id',
        'payment_voucher_detail_id',
        'sort_order',
        'account_id',
        "cheque_no",
        "cheque_date",
        // 'document_amount',
        'payment_amount',
        // 'tax_amount',
        // 'tax_percent',
        // 'net_amount',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
    ];

    protected $casts = [
        // 'document_amount' => 'decimal:2',
        'payment_amount'  => 'decimal:2',
        // 'tax_amount'      => 'decimal:2',
        // 'tax_percent'     => 'decimal:2',
        // 'net_amount'      => 'decimal:2',
        
    ];

    // Relationships
    public function paymentVoucher()
    {
        return $this->belongsTo(PaymentVoucher::class, 'payment_voucher_id', 'payment_voucher_id');
    }
    public function account()
    {
        return $this->belongsTo(Accounts::class, 'account_id', 'account_id');
    }
}
