<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BurnFeedSystem extends Model 
{
    protected $primaryKey = 'id'; 
    public $incrementing = false; 
    protected $table = 'brun_feed_system';
    
    protected $fillable = [
        'id','request_id','feed_stations','feed_type','anti_bully_bars','sort_order'
    ];
}  

