<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtherModel extends Model
{
    protected $connection = 'detail';
    protected $table = 'const_gl_type';
}