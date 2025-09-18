<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accounts extends Model
{
    protected $table = 'accounts';
    protected $primaryKey = 'account_id';
    public $incrementing = false; // UUID
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'account_id',
        'company_id',
        'gl_type_id',
        'parent_account_id',
        'head_account_id',
        'account_code',
        'name',
        'status',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by'
    ];

    // Relationships
    public function glType()
    {
        return $this->belongsTo(ConstGlType::class, 'gl_type_id', 'gl_type_id');
    }

    public function accountHead()
    {
        return $this->belongsTo(AccountHeads::class, 'head_account_id', 'head_account_id');
    }

    public function parentAccount()
    {
        return $this->belongsTo(Accounts::class, 'parent_account_id', 'account_id');
    }
    /**
     * Check if assigning the given parent_id will create a cycle
     *
     * @param  int|null $newParentId
     * @return bool
     */
    public function wouldCauseCycle($newParentId)
    {
        // If no parent (root), no cycle
        if (!$newParentId || $newParentId == 0) {
            return false;
        }

        // If parent is itself
        if ($this->account_id == $newParentId) {
            return true;
        }

        // Walk up the tree
        $parent = self::find($newParentId);
        while ($parent) {
            if ($parent->account_id == $this->account_id) {
                return true; // cycle detected
            }
            $parent = $parent->parentAccount;
        }

        return false; // safe
    }
}
