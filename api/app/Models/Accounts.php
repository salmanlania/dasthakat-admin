<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accounts extends Model
{
    protected $table = 'accounts';
    protected $primaryKey = 'account_id';
    public $incrementing = false; // UUID
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'account_id',
        'company_id',
        'gl_type_id',
        'parent_account_id',
        'head_account_id',
        'account_code',
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
 
    public function parentAccount()
    {
        return $this->belongsTo(Accounts::class, 'parent_account_id', 'account_id');
    }
}
