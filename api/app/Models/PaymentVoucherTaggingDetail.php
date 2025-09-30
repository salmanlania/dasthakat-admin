<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentVoucherTaggingDetail extends Model
{
    protected $table = 'payment_voucher_taging_detail';
    protected $primaryKey = 'payment_voucher_taging_detail_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'payment_voucher_taging_id',
        'payment_voucher_taging_detail_id',
        'sort_order',
        'purchase_invoice_id',
        'ref_document_identity',
        'amount',
        'remarks',
        'created_by',
        'updated_by',
    ];

    public function payment_voucher_taging()
    {
        return $this->belongsTo(PaymentVoucherTagging::class, 'payment_voucher_taging_id', 'payment_voucher_taging_id');
    }

    public function payment_voucher_detail()
    {
        return $this->belongsTo(PaymentVoucherDetail::class, 'payment_voucher_detail_id', 'payment_voucher_detail_id');
    }


}
