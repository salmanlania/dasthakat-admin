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
        'vendor_rate', 
        'is_primary_vendor', 
        'vendor_part_no',
        'vendor_notes',
        'created_by', 
        'updated_by'
    ];
}
