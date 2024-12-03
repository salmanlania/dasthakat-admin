<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Mail\GenerateMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
	 protected $db;
    
    public function index(Request $request)
    {
        if(!isPermission('list','user',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
		$login_name = $request->input('login_name','');
		$user_name = $request->input('user_name','');
		$email =  $request->input('email','');

		$search = $request->input('search','');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column','created_at');
    	$sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';

    	$users = User::query();
		if(!empty($login_name)) $users = $users->where('login_name', 'like', '%'.$login_name.'%');
	 	if(!empty($user_name)) $users = $users->where('user_name', 'like', '%'.$user_name.'%');
	 	if(!empty($email)) $users = $users->where('email', 'like', '%'.$email.'%');
	 
		if (!empty($search)) {
				$search = strtolower($search);
				$users = $users->where(function ($query) use ($search){		       	       
				$query
				->where('user_name', 'like', '%' . $search . '%')
				->orWhere('login_name', 'like', '%' . $search . '%')
				->orWhere('email', 'like', '%' . $search . '%')
				->orWhere('created_at', 'like', '%' . $search . '%');
					
			});
						
			}
		
		$users = $users->select('*');
		$users =  $users->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
		
        return response()->json( $users);
    }
    
    public function show($id,Request $request)
    {
    	 if(!isPermission('edit','user',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");

         $user = User::with('permission:user_permission_id,name')->where('user_id',$id)->first();
	 $user['image_url']  = !empty($user['image']) ?  url('public/uploads/'.$user['image']) : '';
         return $this->jsonResponse($user,200,"User Data");
    }
    
     public function validateRequest($request,$id=null) 
     {
      $rules = [
		  	'company_id' => 'required',
			'login_name' => ['required',Rule::unique('user')->ignore($id, 'user_id')],
		  	'user_name' => 'required',
		  	'email' => 'required',
	    	'permission_id' => 'required',
      ];
      
      if(!empty($request['login_password']) || !$id){
	  $rules['login_password'] = 'required|min:8';
      }
      
   
     $validator = Validator::make($request, $rules);  
     $response = []; 
	    if ($validator->fails()) {
	        $response =  $errors = $validator->errors()->all();
		 $firstError = $validator->errors()->first();
	         return  $firstError;
		
	    }
   	return [];
    }
    
    

    public function store(Request $request)
    {  
       // Validation Rules
      $isError = $this->validateRequest($request->all());
      if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
	
    //   try{
	// DB::beginTransaction();
      
        $data      = $request->all();
 	$imageData = $data['image'] ?? "";
	$image = "";
	if(isset($imageData) && !empty($imageData))
 	   $image = $this->base64ToImage($imageData);
	$uuid = $this->get_uuid();
	
	$insertArr = [
		'company_id' => $request->company_id ?? "",
	    'user_id' => $uuid,
	    'permission_id' => $request->permission_id,
        'login_name' => $request->login_name ?? "",
        'login_password'=> md5($request->password),
        'user_name' => $request->user_name ?? "",
	    'email' => $request->email,
	    'status'=> $request->status ?? 0,
	    'from_time' => $request->from_time,
	    'to_time' => $request->to_time,
        ];
	
	if(isset($imageData) && !empty($imageData))
	   $insertArr['image'] =  $image;
	
   
	 //Add User Data
         $user = User::create($insertArr);
	 
	 // Email Generate update Settings
	//  $config = $this->SystemConfig("Create User");
	//  $message = $config['description'] ?? "";
	//  $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);

     
    //     $message = (str_replace('<Email>' , $insertArr['email'] , $message));
	// $message = (str_replace('<Password>' , $request->password , $message));
	// $message = (str_replace('<Link>' , '<a href="'.env("SITE_URL").'">'.env("SITE_ADDRESS").'</a>' , $message));
	 
	//   $data = [
	//         'email' => $insertArr['email'],
	//     	'name' => 'Welcome '.$insertArr['name'],
	// 	'subject' => $config['subject'],
	// 	'message' => $message];
     
	// 	  $resp = $this->sentMail($data);
	// 	  if(!empty($resp )) exit;
		  
	//   DB::commit();
	//  }
	//  catch (\Exception $e) {
	//  	DB::rollBack();
    //  	Log::error('Email sending failed: ' . $e->getMessage());
	//     return $this->jsonResponse('Email Not Sent.Please Check Your Email or Contact to your Administrator!',400,"Email Not Sent!");
    // }
      
         return $this->jsonResponse(['user_id'=>$uuid],200,"Add User Successfully!");
    }
    
    public function update( Request $request,$id)
    {  
       // Validation Rules
       $isError = $this->validateRequest($request->all(),$id);
       if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
        
	$data      = $request->all();
 	$imageData = $data['image'];
	$image = "";
	if(isset($imageData) && !empty($imageData))
 	   $image = $this->base64ToImage($imageData);
	
       
        $user  = User::where('user_id',$id)->first();
        $user->company_id  = $request->company_id ?? "";
        $user->login_name  = $request->login_name ?? "";
        $user->user_name  = $request->user_name ?? "";
		$user->email = $request->email;
		$user->permission_id = $request->permission_id;
		$user->status = $request->status ?? 0;
		$user->from_time = $request->from_time ;
		$user->to_time = $request->to_time ;

	 //Delete Images
	 if(isset($request->delete_image) && !empty($request->delete_image)){
	       $old_image = str_replace(env('SITE_URL').'/api/','',$request->delete_image);
	       $user->image = null;
	       if(file_exists($old_image))
	 	unlink($old_image);
	 }
	
	if(isset($imageData) && !empty($imageData)){
	   $user->image = $image;
	
	}
    
	 if(!empty($request->login_password)){
	    $user->login_password = md5($request->login_password);
	 }
	
	  $user->update();		
		

         return $this->jsonResponse(['user_id'=>$id],200,"Update User Successfully!");
    }
    public function delete($id,Request $request)
    {  
	if(!isPermission('delete','user',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
    	 $user  = User::where('user_id',$id)->first();
	 
	 if(!$user) return $this->jsonResponse(['user_id'=>$id],404,"User Not Found!");

	 $user->delete();

	 return $this->jsonResponse(['user_id'=>$id],200,"Delete User Successfully!");
    }
    public function bulkDelete(Request $request) {
    	if(!isPermission('delete','user',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
        try {
            if (isset($request->user_ids) && !empty($request->user_ids) && is_array($request->user_ids)) {
                foreach ($request->user_ids as $user_id) {
                    $user = User::where(['user_id' => $user_id])->first();
					$user->delete();
                }
            }
	    
	    return $this->jsonResponse('Deleted',200,"Delete Users successfully!");
        } catch (\Exception $e) {
	    return $this->jsonResponse('some error occured',500,$e->getMessage());
        }  
    }
    
    
    public function changePassword(Request $request) {
    		
      	$rules = [
		'user_id' => 'required',
		'password' => 'required',
		'new_password' => 'required|min:8',
		'confirm_password' => 'required|same:new_password'
	];	
        $validator = Validator::make($request->all(), $rules);  
    
        if ($validator->fails()) {
	    $response =  $errors = $validator->errors()->all();
	    $firstError = $validator->errors()->first();
	    return $this->jsonResponse( $firstError,400,"Request Failed!");
	}
	
	
	try{
	DB::beginTransaction();
	
	// Get User Detail
         $user = User::where('id',$request->user_id)->where('password',md5($request->password))->first();
	 if(empty($user)) return $this->jsonResponse("Old Password is Incorrect!",400,"Invalid Password!");
	 
     
	 $user->password = md5($request->new_password);
	 $user->is_change_password = 1;
	 $user->update(); 
	 
	 
	  // Email Generate update Settings
	 $config = $this->SystemConfig("Update Password");
	 $message = $config['description'] ?? "";
	 $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);
	 $message = (str_replace('<Link>' , '<a href="'.env("SITE_URL").'">'.env("SITE_ADDRESS").'</a>' , $message));
	 
	  $data = [
	        'email' => $user["email"],
	    	'name' => 'Dear '.$user["name"],
		'subject' => $config['subject'],
		'message' => $message];	
		
         $resp = $this->sentMail($data);
	 if(!empty($resp )) exit;
	
	
	 DB::commit();
	 }catch (\Exception $e) {
	          DB::rollBack();
    		Log::error('Email sending failed: ' . $e->getMessage());
	       return $this->jsonResponse('Email Not Sent.Please Check Your Email or Contact to your Administrator!',400,"Email Not Sent!");
         }
      

	return $this->jsonResponse('Update Password',200,"Update Password Successfully!");
    }
    

}
