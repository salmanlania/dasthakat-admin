<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class QuotationStatus extends Model
{

    protected $table = 'quotation_status';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $updated_at = false;
    protected $keyType = 'string';
    protected $fillable = [
        "id",
        "quotation_id",
        "status",
        "created_by",
        "created_at"
    ];

   
}
