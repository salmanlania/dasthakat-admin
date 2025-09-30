<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentVoucherTagging extends Model
{
    protected $table = 'payment_voucher_taging';
    protected $primaryKey = 'payment_voucher_taging_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'company_id',
        'company_branch_id',
        'payment_voucher_taging_id',
        'document_type_id',
        'document_prefix',
        'document_no',
        'document_identity',
        'document_date',
        'supplier_id',
        'payment_voucher_id',
        'base_currency_id',
        'document_currency_id',
        'conversion_rate',
        'total_amount',
        'remarks',
        'created_by',
        'updated_by',
    ];

    public function details()
    {
        return $this->hasMany(PaymentVoucherTaggingDetail::class, 'payment_voucher_taging_id', 'payment_voucher_taging_id')->orderBy('sort_order');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
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
