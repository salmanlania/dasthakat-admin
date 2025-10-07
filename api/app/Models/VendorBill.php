<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorBill extends Model
{
    use HasFactory;

    protected $table = 'vendor_bill';
    protected $primaryKey = 'vendor_bill_id';
    public $incrementing = false; // UUID (char 36)
    protected $keyType = 'string';
    public $timestamps = false; // we manage created_at / updated_at manually

    protected $fillable = [
        'company_id',
        'company_branch_id',
        'vendor_bill_id',
        'document_type_id',
        'document_prefix',
        'document_no',
        'document_identity',
        'document_date',
        'base_currency_id',
        'document_currency_id',
        'transaction_account_id',
        'supplier_id',
        'conversion_rate',
        'total_amount',
        'remarks',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
    ];

    protected $casts = [
        'document_date'  => 'date',
        'total_amount'   => 'decimal:2',
    ];

    // Relationships
    public function details()
    {
        return $this->hasMany(VendorBillDetail::class, 'vendor_bill_id', 'vendor_bill_id')->orderBy('sort_order');
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
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }
}
