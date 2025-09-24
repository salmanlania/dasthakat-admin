<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorPaymentDetail extends Model
{
    protected $table = 'vendor_payment_detail';
    protected $primaryKey = 'vendor_payment_detail_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'vendor_payment_id',
        'vendor_payment_detail_id',
        'sort_order',
        'purchase_invoice_id',
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
        return $this->belongsTo(VendorPayment::class, 'vendor_payment_id', 'vendor_payment_id');
    }

    public function purchase_invoice()
    {
        return $this->belongsTo(PurchaseInvoice::class, 'purchase_invoice_id', 'purchase_invoice_id');
    }
    
    public function account()
    {
        return $this->belongsTo(Accounts::class, 'account_id', 'account_id');
    }
    
}
