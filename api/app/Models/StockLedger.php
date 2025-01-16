<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockLedger extends Model
{


        protected $table = 'core_stock_ledger';

        protected $fillable = [
                'company_id',
                'company_branch_id',
                'fiscal_year_id',
                'document_type_id',
                'document_id',
                'document_identity',
                'document_date',
                'warehouse_id',
                'document_detail_id',
                'product_id',
                'document_unit_id',
                'document_qty',
                'unit_conversion',
                'base_unit_id',
                'base_qty',
                'document_currency_id',
                'document_rate',
                'document_amount',
                'currency_conversion',
                'base_currency_id',
                'base_rate',
                'base_amount',
                'remarks',
                'created_at',
                'created_by',
                'unit',
                'sort_order',

        ];
}
