<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $table = 'audit';
    public $timestamps = false;
    protected $primaryKey = 'audit_id';
    protected $fillable = ['company_id', 'company_branch_id', 'audit_id', 'action', 'action_on', 'action_by', 'action_at', 'document_type', 'document_id', 'document_name', 'json_data'];
    protected $updated_at = false;
    protected $casts = [
        'json_data' => 'array',
    ];
    public function action_by_user()
    {
        return $this->hasOne(User::class, 'user_id', 'action_by');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }

    public function company_branch()
    {
        return $this->belongsTo(CompanyBranch::class, 'company_branch_id', 'company_branch_id');
    }

    static protected function onEdit($arg = [])
    {

        Audit::create([
            'company_id' => $arg['request']['company_id'],
            'company_branch_id' => $arg['request']['company_branch_id'],
            'action' => "Update",
            'action_on' => $arg['table'],
            'action_by' => $arg['request']['login_user_id'],
            'action_at' => Carbon::now(),
            'document_type' => $arg['document_type'],
            'document_id' => $arg['id'],
            'document_name' => $arg['document_name'],
            'json_data' => $arg['json_data'],
        ]);
    }
    static protected function onInsert($arg = [])
    {

        Audit::create([
            'company_id' => $arg['request']['company_id'],
            'company_branch_id' => $arg['request']['company_branch_id'],
            'action' => "Insert",
            'action_on' => $arg['table'],
            'action_by' => $arg['request']['login_user_id'],
            'action_at' => Carbon::now(),
            'document_type' => $arg['document_type'],
            'document_id' => $arg['id'],
            'document_name' => $arg['document_name'],
            'json_data' => $arg['json_data'],
        ]);
    }
    static protected function onDelete($arg = [])
    {

        Audit::create([
            'company_id' => $arg['request']['company_id'],
            'company_branch_id' => $arg['request']['company_branch_id'],
            'action' => "Delete",
            'action_on' => $arg['table'],
            'action_by' => $arg['request']['login_user_id'],
            'action_at' => Carbon::now(),
            'document_type' => $arg['document_type'],
            'document_id' => $arg['id'],
            'document_name' => $arg['document_name'],
            'json_data' => $arg['json_data'],
        ]);
    }
}
