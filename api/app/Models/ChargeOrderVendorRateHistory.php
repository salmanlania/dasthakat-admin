<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class ChargeOrderVendorRateHistory extends Model
{
    protected $table = 'charge_order_vendor_rate_history';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'vp_charge_order_rfq_id',
        'vp_charge_order_rfq_detail_id',
        'charge_order_id',
        'charge_order_detail_id',
        'product_id',
        'product_name',
        'product_description',
        'vendor_id',
        'vendor_rate',
        'validity_date',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    ];
    public static function getLastValidRate(?string $vendorId, ?string $productId, ?string $productName): ?float
    {
        if (empty($vendorId)) {
            return null;
        }

        $query = QuotationVendorRateHistory::query()
            ->where('vendor_id', $vendorId)
            ->whereNotNull('vendor_rate')
            ->where('vendor_rate', '>', 0);

        if (!empty($productId)) {
            $query->where('product_id', $productId);
        } else if (!empty($productName)) {
            $query->where('product_name', $productName);
        } else {
            return null;
        }

        $row = $query
            ->orderByDesc('created_at')
            ->first();
            if($row &&  $row->validity_date >= date('Y-m-d')) {
                return $row?->vendor_rate ? $row->vendor_rate : null;
            }
            return null;
    }
    public static function getLastValidRateValidityDate(?string $vendorId, ?string $productId, ?string $productName): ?string
    {
        if (empty($vendorId)) {
            return null;
        }

        $query = ChargeOrderVendorRateHistory::query()
            ->where('vendor_id', $vendorId)
            ->whereNotNull('vendor_rate')
            ->where('vendor_rate', '>', 0);

        if (!empty($productId)) {
            $query->where('product_id', $productId);
        } else if (!empty($productName)) {
            $query->where('product_name', $productName);
        } else {
            return null;
        }

        $row = $query
            ->orderByDesc('created_at')
            ->first();
            if($row &&  $row->validity_date >= date('Y-m-d')) {
                return $row?->validity_date ? $row->validity_date : null;
            }
            return null;
    }
}
