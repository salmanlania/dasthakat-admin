<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountHeads extends Model
{
    protected $table = 'account_heads';
    protected $primaryKey = 'head_account_id';
    public $incrementing = false; // UUID
    public $timestamps = false;

    protected $fillable = [
        'head_account_id',
        'company_id',
        'head_account_name',
        'head_account_type',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by'
    ];

}
