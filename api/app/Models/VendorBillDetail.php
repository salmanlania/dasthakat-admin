<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorBillDetail extends Model
{
    use HasFactory;

    protected $table = 'vendor_bill_detail';
    protected $primaryKey = 'vendor_bill_detail_id';
    public $incrementing = false; // UUID
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'vendor_bill_id',
        'vendor_bill_detail_id',
        'sort_order',
        'account_id',
        'remarks',
        'amount',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
    ];

    protected $casts = [
        'amount'  => 'decimal:2',

    ];

    // Relationships
    public function vendorBill()
    {
        return $this->belongsTo(VendorBill::class, 'vendor_bill_id', 'vendor_bill_id');
    }

    public function account()
    {
        return $this->belongsTo(Accounts::class, 'account_id', 'account_id');
    }
}
