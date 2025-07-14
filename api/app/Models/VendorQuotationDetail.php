<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorQuotationDetail extends Model
{
    protected $table = 'vendor_quotation_detail';
    protected $primaryKey = 'vendor_quotation_detail_id';
    public $incrementing = false;

    protected $fillable = [
        'company_id', 
        'company_branch_id', 
        'vendor_quotation_detail_id', 
        'quotation_id', 
        'quotation_detail_id', 
        'vendor_id', 
        'sort_order', 
        'vendor_rate', 
        'is_primary_vendor', 
        'vendor_part_no',
        'vendor_notes',
        'created_by', 
        'updated_by'
    ];


    public function quotation_detail()
    {
        return $this->belongsTo(QuotationDetail::class, 'quotation_detail_id', 'quotation_detail_id');
    }
    public function vendor()
    {
        return $this->belongsTo(Supplier::class, 'vendor_id', 'supplier_id');
    }
}
