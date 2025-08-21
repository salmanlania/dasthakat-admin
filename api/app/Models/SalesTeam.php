<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesTeam extends Model
{
    protected $table = 'sales_team';
    protected $primaryKey = 'sales_team_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'company_id',
        'company_branch_id',
        'sales_team_id',
        'name',
        'created_by',
        'updated_by',
    ];
}
