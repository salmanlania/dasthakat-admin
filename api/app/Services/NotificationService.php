<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class NotificationService
{
    public function getNotifications($request)
    {
        $status =$request->input('status');
        $search = $request->search;
	
        $page = $request->input('page', 1);
        $perPage = $request->input('limit', 10);
        $sort_column = $request->input('sort_column', 'notifications.created_at');
        $sort_direction = $request->input('sort_direction') == 'ascend' ? 'asc' : 'desc';

        $notifications = Notification::join('user', 'user.id', '=', 'notifications.created_by');
	$notifications = $notifications->where('notifications.is_deleted',0);

        if ($status!=null) {
            $notifications = $notifications->where('notifications.is_read', $status);
        }

        if (!empty($search)) {
            $search = strtolower($search);
            $notifications = $notifications->where('heading_text', 'like', '%' . $search . '%');
        }

        return $notifications->select('notifications.*', 'user.name as name','user.image',DB::raw('concat("public/uploads/", user.image) as image_url'))
            ->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);
    }
    
    	public function deleteNotification($id,$request)
	{

		$notifications = Notification::where('id', $id)->first();

		if (empty($notifications))
			return $this->jsonResponse(['notification_id' => $id], 404, "Notification Not Found!");

		$notifications->is_deleted = 1;
		$notifications->save();
		return $this->jsonResponse(['notification_id' => $id], 200, "Delete Notification Successfully!");
	}

}