<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChargeOrderCommissionAgent extends Model
{
    protected $table = 'charge_order_commission_agent';
    protected $primaryKey = 'id'; 
    protected $keyType = 'string';
    public $incrementing = false; 
    protected $fillable = [
        'id','charge_order_id','commission_agent_id','sort_order','vessel_id','customer_id','percentage','amount','created_by','updated_by'
    ];
}