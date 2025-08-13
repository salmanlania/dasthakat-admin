<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    /**
     * Add alias method for query builder.
     */
    public static function alias(string $alias)
    {
        $instance = new static;
        return $instance->from($instance->getTable() . ' as ' . $alias);
    }
}
