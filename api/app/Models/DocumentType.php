<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DocumentType extends Model
{

    protected $table = 'const_document_type';
    protected $primaryKey = 'document_type_id';
    public $incrementing = false;
    protected $fillable = ["*"];

    static public function getNextDocument($document_type_id, $data)
    {
        $row = DB::table('core_company_branch_document_prefix')
            ->where('company_id', $data['company_id'])
            ->where('company_branch_id', $data['company_branch_id'])
            ->where('document_type_id', $document_type_id)
            ->first();

        if (!$row) {
            $row = DocumentType::where('document_type_id', $document_type_id)
                ->first();
        }
        $branch = CompanyBranch::where('company_branch_id', $data['company_branch_id'])->first();
        $prefix = str_replace(
            ['{BC}'],
            [$branch['branch_code']],
            $row->document_prefix
        );

        $table_name = $row->table_name;
        $max_no_record = DB::table($table_name)
            ->where('company_id', $data['company_id'])
            ->where('company_branch_id', $data['company_branch_id'])
            ->where('document_prefix', $prefix)
            ->max('document_no');
        $max_no = $max_no_record ? $max_no_record + 1 : 1;

        $document_identity = $prefix . str_pad($max_no, $row->zero_padding, "0", STR_PAD_LEFT);

        return [
            'document_type_id' => $row->document_type_id,
            'document_type' => $row->document_name,
            'document_no' => $max_no,
            'document_prefix' => $prefix,
            'document_identity' => $document_identity,
            'table_name' => $row->table_name,
            'primary_key' => $row->primary_key
        ];
    }
}
