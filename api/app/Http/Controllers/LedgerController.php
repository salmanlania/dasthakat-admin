<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ledger;
use Illuminate\Support\Facades\DB;

class LedgerController extends Controller
{
    public function getDocumentLedger(Request $request)
    {

        $data = Ledger::leftJoin('accounts as a', 'a.account_id', '=', 'core_ledger.account_id')
            ->leftJoin('customer as c', 'c.customer_id', '=', 'core_ledger.partner_id')
            ->leftJoin('supplier as s', 's.supplier_id', '=', 'core_ledger.partner_id')
            ->leftJoin('currency as dc', 'dc.currency_id', '=', 'core_ledger.document_currency_id')
            ->leftJoin('currency as bc', 'bc.currency_id', '=', 'core_ledger.base_currency_id')
            ->leftJoin('product as p', 'p.product_id', '=', 'core_ledger.product_id')

            ->where('core_ledger.document_type_id', $request->document_type_id)
            ->where('core_ledger.document_id', $request->document_id)
            ->where('core_ledger.company_id', $request->company_id)
            ->where('core_ledger.company_branch_id', $request->company_branch_id)
            ->select(
                'core_ledger.*',
                'a.account_code as account_code',
                'a.name as account_name',
                DB::raw('concat(a.account_code, " - ", a.name) as display_account_name'),
                'c.name as customer_name',
                's.name as supplier_name',
                'dc.currency_code as document_currency_code',
                'dc.name as document_currency_name',
                'bc.currency_code as base_currency_code',
                'bc.name as base_currency_name',
                'p.name as product_name',
                DB::raw("CASE WHEN sum(debit-credit) > 0 THEN sum(debit-credit) ELSE 0 END as debit"),
                DB::raw("CASE WHEN sum(debit-credit) < 0 THEN sum(credit-debit) ELSE 0 END as credit")
            )
            ->groupBy('account_id')
            ->orderBy('debit', 'desc')
            ->orderBy('credit')
            ->orderBy('sort_order')
            ->get();

        $res['data'] = $data;
        $res['total_debit'] = $data->sum('debit');
        $res['total_credit'] = $data->sum('credit'); 
        return $this->jsonResponse($res, 200, 'Document Ledger Data');
    }
   
}
