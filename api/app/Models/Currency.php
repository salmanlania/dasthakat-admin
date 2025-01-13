<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $table = 'currency';
    protected $primaryKey = 'currency_id';
    public $incrementing = false;

    protected $fillable = [
        'company_id',
        'company_branch_id',
        'currency_id',
        'currency_code',
        'name',
        'symbol_left',
        'symbol_right',
        'value',
        'status',
        'created_by',
        'updated_by'
    ];
}
