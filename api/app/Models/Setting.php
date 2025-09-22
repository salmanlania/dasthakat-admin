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

   static public function getValue($module, $field)
  {
    return Setting::where('module', $module)->where('field', $field)->first()->value ?? null;
  }
  static public function getRow($module, $field)
  {
    return Setting::where('module', $module)->where('field', $field)->first();
  }
}
