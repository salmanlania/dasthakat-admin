<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ControlAccess extends Model
{
    // protected $connection = 'other_connection';
    protected $table = 'control_access';
    protected $primaryKey = 'control_access_id';
    public $updated_at = false;

}