<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Country;
use App\Models\ControlAccess;
use App\Models\ParlourModule;
use App\Models\QuoteRequest;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use DB;
class DashboardController extends Controller
{
	 protected $db;
    
    public function index(Request $request)
    {
        $data = array();
       //  Get Total Quote
	   $total_quote = QuoteRequest::where('is_deleted',0);
       if(isset($request->user_type) && $request->user_type!='Internal'){
        $total_quote = $total_quote->where('created_by',$request->user_id);
       }else{
       	 $total_quote = $total_quote->where('status','!=','Draft');
       }
       $total_quote = $total_quote->count();
       $data['total_quote']  = $total_quote;
	// Get All Staus And Count
       $quote_status = QuoteRequest::where('is_deleted',0);
       if(isset($request->user_type) && $request->user_type!='Internal'){
        $quote_status = $quote_status->where('created_by',$request->user_id);
       }else{
         $quote_status = $quote_status->where('status','!=','Draft');
       }
       $quote_status = $quote_status->select('status', DB::raw('count(*) as count'));
       $quote_status = $quote_status->groupBy('status')->pluck('count', 'status');
       $data['quote_status']  = $quote_status;
       
       $data['banner'] = Banner::first();
        
      return $this->jsonResponse($data, 200, "Quote Request Status");
    }
}
