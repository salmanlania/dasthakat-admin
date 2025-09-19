<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{


  protected $primaryKey = 'id';
  protected $keyType = 'string';
  public $incrementing = false;
  protected $table = 'setting';


  /**
   * The attributes that are mass assignable.
   *
   * @var string[]
   */
  protected $fillable = [
    'id',
    'module',
    'field',
    'value',
    'created_at'
  ];
}
