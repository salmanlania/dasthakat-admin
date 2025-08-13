<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoaLevel1 extends Model
{
    protected $table = 'coa_level1';
    protected $primaryKey = 'coa_level1_id';
    public $incrementing = false; // UUID
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'coa_level1_id',
        'company_id',
        'gl_type_id',
        'level1_code',
        'name',
        'status',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by'
    ];

    // Relationships
    public function glType()
    {
        return $this->belongsTo(ConstGlType::class, 'gl_type_id', 'gl_type_id');
    }

    public function level2()
    {
        return $this->hasMany(CoaLevel2::class, 'coa_level1_id', 'coa_level1_id');
    }
}
