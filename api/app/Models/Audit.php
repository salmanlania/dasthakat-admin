<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $table = 'audit';
    public $timestamps = false;
    protected $primaryKey = 'audit_id';
    protected $fillable = ['company_id', 'company_branch_id', 'audit_id','action','action_on','action_by', 'action_at', 'document_type', 'document_id','document_name', 'json_data'];
    protected $updated_at = false;
    protected $casts = [
        'json_data' => 'array',
    ];

}
