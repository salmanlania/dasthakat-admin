<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    use HasFactory;

    protected $table = 'core_ledger';
    protected $primaryKey = 'ledger_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'ledger_id',
        'company_id',
        'company_branch_id',
        
        'document_type_id',
        'document_id',
        'document_identity',
        'document_detail_id',
        'document_date',
        'sort_order',
        
        'partner_type',
        'partner_id',

        'ref_document_type_id',
        'ref_document_identity',
        
        'account_id',
        'remarks',
        'document_currency_id',
        'document_debit',
        'document_credit',
        'base_currency_id',
        'conversion_rate',
        'debit',
        'credit',
        'product_id',
        'qty',
        'document_amount',
        'amount',
        'created_at',
        'created_by_id',
        'cheque_no',
        'cheque_date',
    ];

    protected $casts = [
        'document_date'   => 'date',
        'cheque_date'     => 'date',
        'document_debit'  => 'decimal:2',
        'document_credit' => 'decimal:2',
        'conversion_rate' => 'decimal:2',
        'debit'           => 'decimal:2',
        'credit'          => 'decimal:2',
        'qty'             => 'decimal:2',
        'document_amount' => 'decimal:2',
        'amount'          => 'decimal:2',
    ];
}
