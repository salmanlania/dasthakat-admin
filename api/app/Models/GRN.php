<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class GRN extends Model
{

    protected $table = 'good_received_note';
    protected $primaryKey = 'good_received_note_id';
    public $incrementing = false;

    protected $fillable = [
        "company_id",
        "company_branch_id",
        "good_received_note_id",
        "document_type_id",
        "document_no",
        "document_prefix",
        "document_identity",
        "document_date",
        "supplier_id",
        "purchase_order_id",
        "quotation_id",
        "charge_order_id",
        "payment_id",
        "remarks",
        "total_quantity",
        "total_amount",
        "created_by",
        "updated_by"
    ];

    public function grn_detail()
    {
        return $this->hasMany(GRNDetail::class, 'good_received_note_id', 'good_received_note_id')->orderBy('sort_order');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'payment_id', 'payment_id')->select('payment_id', 'name');
    }

    public function supplier()
    {
        return $this->hasOne(Supplier::class, 'supplier_id', 'supplier_id')->select('supplier_id', 'name');
    }


    public function purchase_order()
    {
        //     return $this->hasOne(PurchaseOrder::class, 'purchase_order_id','purchase_order_id')->select('*');

        return $this->hasOne(PurchaseOrder::class, 'purchase_order_id', 'purchase_order_id')
            ->leftJoin('charge_order as c', 'c.charge_order_id', '=', 'purchase_order.charge_order_id')
            ->leftJoin('event as e', 'e.event_id', '=', 'c.event_id')
            ->leftJoin('vessel as v', 'v.vessel_id', '=', 'c.vessel_id')
            ->select(
                'purchase_order.*',
                DB::raw("CONCAT(purchase_order.document_identity , ' - ', e.event_code, ' (', v.name, ')') as purchase_order_no"),
            );
    }

    public function quotation()
    {
        return $this->hasOne(Quotation::class, 'quotation_id', 'quotation_id')->select('*');
    }

    public function charge_order()
    {
        return $this->hasOne(ChargeOrder::class, 'charge_order_id', 'charge_order_id')->select('*');
    }
}
