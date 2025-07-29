<?php

namespace App\Models\VendorPlatform;

use App\Models\Quotation;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Model;

class VpQuotationRfq extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vp_quotation_rfq';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'company_id',
        'company_branch_id',
        'document_type_id',
        'document_no',
        'document_prefix',
        'document_identity',
        'vendor_ref_no',
        'vendor_remarks',
        'quotation_id',
        'vendor_id',
        'status',
        'total_items',
        'items_quoted',
        'date_required',
        'date_sent',
        'date_returned',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'total_items' => 'integer',
        'items_quoted' => 'integer',
    ];

    //relationships
    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }
    public function details()
    {
        return $this->hasMany(VpQuotationRfqDetail::class, 'id');
    }

    public function vendor()
    {
        return $this->belongsTo(Supplier::class, 'vendor_id', 'supplier_id');
    }
    
}
