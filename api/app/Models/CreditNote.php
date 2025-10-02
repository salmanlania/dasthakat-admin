<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditNote extends Model
{
    protected $table = 'credit_note';
    protected $primaryKey = 'credit_note_id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'company_id',
        'company_branch_id',
        'credit_note_id',
        'document_type_id',
        'document_no',
        'document_prefix',
        'document_identity',
        'document_date',
        'event_id',
        'sale_invoice_id',
        'credit_amount',
        'credit_precent',
        'created_by',
        'updated_by'
    ];
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }
    public function company_branch()
    {
        return $this->belongsTo(CompanyBranch::class, 'company_branch_id', 'company_branch_id');
    }
    public function created_user()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id')->select('user_id', 'email', 'user_name');
    }
    public function updated_user()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id')->select('user_id', 'email', 'user_name');
    }
}
