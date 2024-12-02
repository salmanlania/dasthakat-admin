<?php
namespace App\Http\Controllers;
use App\Models\Notification;
use App\Models\Cart;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use DB;

class NotificationController extends Controller
{
    // protected $notificationService;

    public function __construct()
    {   
    	// NotificationService $notificationService
        // $this->notificationService = $notificationService;
    }

    public function index(Request $request)
    {
        $user_type =$request->input('user_type');
	$user_id =$request->input('user_id');
        $status =$request->input('status');
        $search = $request->search;
	
        $page = $request->input('page', 1);
        $perPage = $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'notifications.created_at');
        $sort_direction = $request->input('sort_direction') == 'ascend' ? 'asc' : 'desc';

        $notifications = Notification::join('user', 'user.id', '=', 'notifications.created_by');
	$notifications = $notifications->join('quote_request as qr','qr.id','=','notifications.request_id');
	$notifications = $notifications->where('notifications.is_deleted',0);
       if($user_type != 'Partner'){
	       $notifications = $notifications->orWhere(function ($query) {
	        $query->where('notifications.user_id', '')
	              ->orWhereNull('notifications.user_id');
	    });
        }else{
	  	$notifications = $notifications->where('notifications.user_id', $user_id);
	}


        if ($status!=null) {
            $notifications = $notifications->where('notifications.is_read', $status);
        }

        if (!empty($search)) {
            $search = strtolower($search);
            $notifications = $notifications->where('heading_text', 'like', '%' . $search . '%');
        }

         $notifications = $notifications->select('notifications.*','qr.status', 'user.name as name','user.image',
	 					DB::raw('concat("public/uploads/", user.image) as image_url'))
            ->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);
	    
	    
	 // Count unread notifications
	     $total_unread = Notification::join('user', 'user.id', '=', 'notifications.created_by')
	      ->join('quote_request as qr','qr.id','=','notifications.request_id')
	    ->where('notifications.is_deleted', 0)
	    ->where('notifications.is_read', 0);
    
	    if($user_type != 'Partner'){
		      $total_unread = $total_unread->where(function ($query) use ($user_id)  {
		        $query->where('notifications.user_id', $user_id)
			      ->orWhere('notifications.user_id', '')
		                ->orWhereNull('notifications.user_id');
		    });
	    }else{
	     $total_unread = $total_unread->where('notifications.user_id', $user_id);
	    }
    
	   $total_unread =  $total_unread->count();
	    
	     $response = [
	        'data' => $notifications->getCollection()->transform(function ($item) {
	            return $item;
	        }),
	        'pagination' => [
	            'total' => $notifications->total(),
	            'current_page' => $notifications->currentPage(),
	            'last_page' => $notifications->lastPage(),
	            'per_page' => $notifications->perPage(),
	        ],
	        'total_unread' => $total_unread,
		'cart_total' => Cart::where('created_by',$user_id)->count()
	    ];

	 	return $response;
    
       }
       public function readAll(Request $request)
       {
	    $user_id = $request->user_id;
	    $user_type = $request->user_type;
		try {	
		       if($user_type=='Partner'){
			    Notification::where(['user_id' => $user_id])->update(['is_read'=>1]);	
			}else{
		
		              Notification::where(function ($query) use ($user_id) {
			           $query->where('user_id', $user_id)
				        ->orWhere('user_id', '')
			                ->orWhereNull('user_id');
			                  })->update(['is_read'=>1]);
		         }
		    			
			
			return $this->jsonResponse('Read', 200, "Read All Notification Successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
    
    	public function delete($id,Request $request)
	{
		$notifications = Notification::where('id', $id)->first();
		if (empty($notifications))
			return $this->jsonResponse(['notification_id' => $id], 404, "Notification Not Found!");

		$notifications->is_deleted = 1;
		$notifications->save();
		return $this->jsonResponse(['notification_id' => $id], 200, "Delete Notification Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		try {	
			$user = Notification::where(['user_id' => $request->user_id])->update(['is_deleted'=>1]);	
			
			return $this->jsonResponse('Deleted', 200, "Delete All Notification Successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}

}