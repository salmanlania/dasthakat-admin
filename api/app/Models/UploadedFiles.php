<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UploadedFiles extends Model
{
    protected $primaryKey = 'id'; 
    public $incrementing = false; 
    protected $table = 'uploaded_files';
    
    protected $fillable = [
        'id','request_id','file_name','file_path'
    ];
    
}