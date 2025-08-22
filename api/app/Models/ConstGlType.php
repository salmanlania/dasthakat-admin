<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstGlType extends Model
{
    protected $table = 'const_gl_type';
    protected $primaryKey = 'gl_type_id';
    public $timestamps = false; // No created_at/updated_at fields

    protected $fillable = ['name'];

    /**
     * Relationship: One GL Type has many COA Level 1 records
     */
    public function coaLevel1()
    {
        return $this->hasMany(CoaLevel1::class, 'gl_type_id', 'gl_type_id');
    }
}
