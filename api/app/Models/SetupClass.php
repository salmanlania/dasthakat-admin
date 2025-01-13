<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SetupClass extends Model
{
    protected $table = 'class';
    protected $primaryKey = 'class_id';
    public $incrementing = false;
    protected $fillable = [
        'company_id',
        'company_branch_id',
        'class_id',
        'name',
        'created_by',
        'updated_by'
    ];

    
}
