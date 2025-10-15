<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalVoucherDetail extends Model
{
    protected $table = 'journal_voucher_detail';
    protected $primaryKey = 'journal_voucher_detail_id';
    public $incrementing = false; // since CHAR(36) UUID
    protected $keyType = 'string';

    protected $fillable = [
        'journal_voucher_id',
        'journal_voucher_detail_id',
        'sort_order',
        'account_id',
        'debit',
        'credit',
        'remarks',
        'created_by',
        'updated_by',
    ];

    public function journal_voucher()
    {
        return $this->belongsTo(JournalVoucher::class, 'journal_voucher_id', 'journal_voucher_id');
    }

    public function account()
    {
        return $this->belongsTo(Accounts::class, 'account_id', 'account_id');
    }
    
}
