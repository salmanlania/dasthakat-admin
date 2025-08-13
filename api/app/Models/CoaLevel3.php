<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoaLevel3 extends Model
{
    protected $table = 'coa_level3';
    protected $primaryKey = 'coa_level3_id';
    public $incrementing = false; // UUID
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'coa_level3_id',
        'company_id',
        'coa_level2_id',
        'coa_level1_id',
        'level3_code',
        'name',
        'status',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by'
    ];

    // Relationships
    public function level2()
    {
        return $this->belongsTo(CoaLevel2::class, 'coa_level2_id', 'coa_level2_id');
    }

    public function level1()
    {
        return $this->belongsTo(CoaLevel1::class, 'coa_level1_id', 'coa_level1_id');
    }
}
