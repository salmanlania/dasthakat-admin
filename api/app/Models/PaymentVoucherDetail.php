<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
        // "cheque_date",
        "ledger_date",
        "event_id",
        "cost_center_id",
        "supplier_id",
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

    public function event()
    {
        return $this->hasOne(Event::class, 'event_id', 'event_id')
            ->join('vessel', 'vessel.vessel_id', '=', 'event.vessel_id')
            ->select(
                'event.event_id',
                'event.event_code',
                DB::raw("CONCAT(event.event_code, ' (', COALESCE(vessel.name, 'Unknown'), ')') as event_name")
            );
    }

    public function cost_center()
    {
        return $this->belongsTo(CostCenter::class, 'cost_center_id', 'cost_center_id');
    }
    public function account()
    {
        return $this->belongsTo(Accounts::class, 'account_id', 'account_id');
    }
    
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }

}
