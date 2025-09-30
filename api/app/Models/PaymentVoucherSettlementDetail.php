<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentVoucherSettlementDetail extends Model
{
    protected $table = 'payment_voucher_settlement_detail';
    protected $primaryKey = 'payment_voucher_settlement_detail_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'payment_voucher_settlement_id',
        'payment_voucher_settlement_detail_id',
        'sort_order',
        'purchase_invoice_id',
        'ref_document_identity',
        'account_id',
        'amount',
        'remarks',
        'created_by',
        'updated_by',
    ];

    public function payment_settlement()
    {
        return $this->belongsTo(PaymentVoucherSettlement::class, 'payment_voucher_settlement_id', 'payment_voucher_settlement_id');
    }

    public function payment_voucher_detail()
    {
        return $this->belongsTo(PaymentVoucherDetail::class, 'payment_voucher_detail_id', 'payment_voucher_detail_id');
    }

    public function account()
    {
        return $this->belongsTo(Accounts::class, 'account_id', 'account_id');
    }
}
