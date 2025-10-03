<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
        'credit_percent',
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
    public function sale_invoice(){
        return $this->belongsTo(SaleInvoice::class, 'sale_invoice_id', 'sale_invoice_id')->select('*');
    }
    
  public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id')
            ->join('vessel', 'vessel.vessel_id', '=', 'event.vessel_id')
            ->select(
                'event.event_id',
                'event.event_code',
                DB::raw("CONCAT(event.event_code, ' (', COALESCE(vessel.name, 'Unknown'), ')') as event_name")
            );
    }


}
