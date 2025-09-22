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

  static public function getValue($module, $field, $decode = false)
  {
    $value = Setting::where('module', $module)
      ->where('field', $field)
      ->value('value');

    return $decode ? json_decode($value, true) : $value;
  }

  static public function getRow($module, $field)
  {
    return Setting::where('module', $module)->where('field', $field)->first();
  }
}
