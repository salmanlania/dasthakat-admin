<?php

namespace App\Models\VendorPlatform;

use App\Models\Quotation;
use App\Models\QuotationDetail;
use App\Models\Supplier;
use App\Models\VendorQuotationDetail;
use Illuminate\Database\Eloquent\Model;

class VpQuotationRfqDetail extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vp_quotation_rfq_detail';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'detail_id';

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
        'detail_id',
        'id',
        'quotation_detail_id',
        'vendor_quotation_detail_id',
        'created_by',
        'updated_by'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    //relationships
    
    public function quotation_detail()
    {
        return $this->belongsTo(QuotationDetail::class, 'quotation_detail_id');
    }
   

    public function vendor_quotation_detail()
    {
        return $this->belongsTo(VendorQuotationDetail::class, 'vendor_quotation_detail_id', 'vendor_quotation_detail_id');
    }
}
