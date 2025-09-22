<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerPaymentDetail extends Model
{
    protected $table = 'customer_payment';
    protected $primaryKey = 'customer_payment_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'customer_payment_id',
        'customer_payment_detail_id',
        'sort_order',
        'sale_invoice_id',
        'ref_document_identity',
        'original_amount',
        'balance_amount',
        'settled_amount',
        'account_id',
        'created_by',
        'updated_by',
    ];

    public function payment()
    {
        return $this->belongsTo(CustomerPayment::class, 'customer_payment_id', 'customer_payment_id');
    }

    public function sale_invoice()
    {
        return $this->belongsTo(SaleInvoice::class, 'sale_invoice_id', 'sale_invoice_id');
    }
}
