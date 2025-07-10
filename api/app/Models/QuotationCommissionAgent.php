<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuotationCommissionAgent extends Model
{
    protected $table = 'quotation_commission_agent';
    protected $primaryKey = 'id'; 
    public $incrementing = false; 
    protected $fillable = [
        'id','quotation_id','commission_agent_id','sort_order','vessel_id','customer_id','percentage','amount','created_by','updated_by'
    ];
}