<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class CompanyBranchDocumentPrefix extends Model
{

    protected $table = 'core_company_branch_document_prefix';
    protected $primaryKey = 'company_branch_document_prefix_id';
    public $incrementing = false;
    protected $fillable = ["*"];
}
