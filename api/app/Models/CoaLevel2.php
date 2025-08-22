<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoaLevel2 extends Model
{
    protected $table = 'coa_level2';
    protected $primaryKey = 'coa_level2_id';
    public $incrementing = false; // UUID
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'coa_level2_id',
        'company_id',
        'coa_level1_id',
        'level2_code',
        'name',
        'status',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by'
    ];

    // Relationships
    public function level1()
    {
        return $this->belongsTo(CoaLevel1::class, 'coa_level1_id', 'coa_level1_id');
    }

    public function level3()
    {
        return $this->hasMany(CoaLevel3::class, 'coa_level2_id', 'coa_level2_id');
    }
}
