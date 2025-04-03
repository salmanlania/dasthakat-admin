<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class StockLedger extends Model
{


        protected $table = 'core_stock_ledger';
        public $timestamps = false;
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

        static public function handleStockMovement(array $arg, $type = 'I')
        {

                // dd(1);


                $row = $arg['row'] ?? [];
                $document = $arg['master_model']::find($arg['document_id']);
                $multiplier = (int)($type == 'O' ? -1 : 1);
                if (!$document) {
                        throw new \Exception("Document not found with ID: {$arg['document_id']}");
                }
                $unit_conversion = (int)($row['unit_conversion'] ?? 1);
                $currency_conversion = (int)($row['currency_conversion'] ?? 1);
                $quantity = $multiplier * (int)($row['quantity'] ?? 0) * $unit_conversion;
                $rate = ($row['rate'] ?? 0) * $currency_conversion;
                $amount = $multiplier * $quantity * (int)($row['rate'] ?? 0) * $currency_conversion;
                $stock = [
                        'company_id'            => $document->company_id,
                        'company_branch_id'     => $document->company_branch_id,
                        'document_type_id'      => $document->document_type_id,
                        'sort_order'            => $arg['sort_order'] ?? $row['sort_order'] ?? null,
                        'document_id'           => $arg['document_id'],
                        'document_detail_id'    => $arg['document_detail_id'] ?? null,
                        'document_identity'     => $document->document_identity,
                        'document_date'         => $document->document_date,
                        'product_id'            => $row['product_id'] ?? null,
                        'warehouse_id'          => $row['warehouse_id'] ?? null,
                        'unit'                  => $row['unit_name'] ?? null,
                        'document_unit_id'      => $row['unit_id'] ?? null,
                        'document_currency_id'  => $document->document_currency_id ?? null,
                        'document_qty'          => $multiplier * (int)($row['quantity'] ?? 0),
                        'document_rate'         => $row['rate'] ?? 0,
                        'document_amount'       => $multiplier * (int)($row['amount'] ?? 0),
                        'unit_conversion'       => $unit_conversion,
                        'currency_conversion'   => $currency_conversion,
                        'base_unit_id'          => $row['unit_id'] ?? null,
                        'base_currency_id'      => $document->base_currency_id ?? null,
                        'base_qty'              => $quantity,
                        'base_rate'             => $rate,
                        'base_amount'           => $amount,
                        'remarks'               => $row['vendor_notes'] ?? $row['remarks'] ?? null,
                        'created_by'         => $document->created_by,
                        'created_at'            => Carbon::now(),
                ];
                StockLedger::create($stock);
        }

        static public function Check($data, $request)
        {

                if (!isset($data->product_id)) {
                        return ['error' => 'Missing product id'];
                }

                $stock = StockLedger::where('product_id', $data->product_id);
                if (!empty($data->warehouse_id)) {
                        $stock->where('warehouse_id', $data->warehouse_id);
                }
                $stock->where('company_id', $request['company_id']);
                $stock->where('company_branch_id', $request['company_branch_id']);

                $qty = $stock->sum('base_qty');
                $amount = $stock->sum('base_amount');
                return [
                        'quantity' => (int)$qty,
                        'amount'   => (int)$amount,
                ];
        }
}
