<?php
namespace App\Http\Controllers;
use App\Models\Messages;
use App\Models\Notification;
use Illuminate\Http\Request;
use DB;

class MessageController extends Controller
{
    public function __construct()
    {   
    }

    public function index(Request $request)
    {
        $user_id =$request->input('user_id');
        $request_id =$request->input('request_id');
        $search = $request->search;
	
	//Notification Read
	if(!empty($user_id)){
	   $notifications = Notification::where('request_id', $request_id)
			->where('created_by','!=',$user_id)->update(['is_read'=>1]);
	   }
	
        $page = $request->input('page', 1);
        $perPage = $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'messages.created_at');
        $sort_direction = $request->input('sort_direction') == 'ascend' ? 'asc' : 'asc';

        $messages = Messages::join('user', 'user.id', '=', 'messages.created_by');
	$messages = $messages->where('messages.request_id',$request_id);

     
      $messages = $messages->select('messages.*', 'user.name as name','user.image',
	 					DB::raw('concat("public/uploads/", user.image) as image_url'),'user_type')
            ->orderBy($sort_column, $sort_direction)->get();
	    
	    return $this->jsonResponse($messages, 200, "All Messages!");
	
    
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
