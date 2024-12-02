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
		
         $name = $request->input('name','');
	 $permission_id =  $request->input('permission_id','');
	 $user_type =  $request->input('user_type','');
	 $email =  $request->input('email','');
	 
	 $search = $request->input('search','');
	 $page =  $request->input('page', 1); // Default to page 2 if not specified
	 $perPage =  $request->input('limit', 10); // Default to 10 if not specified
	 $sort_column = $request->input('sort_column','user.created_at');
         $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';

         $users = User::join('user_permission', 'user.permission_id', '=', 'user_permission.user_permission_id');
	 $users = $users->where('user.is_deleted',0);
	 if(!empty($name)) $users = $users->where('user.name', 'like', '%'.$name.'%');
	 if(!empty($email)) $users = $users->where('email', 'like', '%'.$email.'%');
	 if(!empty($permission_id)) $users = $users->where('permission_id', '=', $permission_id);
	 if(!empty($user_type)) $users = $users->where('user_type', 'like', '%'.$user_type.'%');
	 
	 if (!empty($search)) {
            $search = strtolower($search);
            $users = $users->where(function ($query) use ($search){		       	       
		$query->where('user.name', 'like', '%' . $search . '%')
		 ->orWhere('email', 'like', '%' . $search . '%')
	    	  ->orWhere('user_type', 'like', '%' . $search . '%')
                  ->orWhere('user.created_at', 'like', '%' . $search . '%');
				
	      });
				      
         }
	  
	 $users = $users->select('user.*','user_permission.name as permission_name');
	 $users =  $users->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $users);
    }
    
    public function show($id,Request $request)
    {
    	 if(!isPermission('edit','user',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");

         $user = User::with('permission:user_permission_id,name','country')->where('id',$id)->first();
	 $user['image_url']  = !empty($user['image']) ?  url('public/uploads/'.$user['image']) : '';
         return $this->jsonResponse($user,200,"User Data");
    }
    
     public function validateRequest($request,$id=null) 
     {
      $rules = [
            'user_type' => 'required',
            'name' => 'required',
	    'email' => [
	            'required',
		    'email',
		     Rule::unique('user')->where('is_deleted',0)->ignore($id)
		     ],
	    'permission_id' => 'required',
	    'phone_no' => 'required' 
      ];
      
      if(!empty($request['password']) || !$id){
	  $rules['password'] = 'required|min:8';
      }
      
      if($request['user_type']=='Partner'){
      	 $rules['organization'] = 'required';
	 $rules['dealer_id'] = 'required';
	 $rules['country_id'] = 'required';
	 $rules['address'] = 'required';
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
	
      try{
	DB::beginTransaction();
      
        $data      = $request->all();
 	$imageData = $data['image'] ?? "";
	$image = "";
	if(isset($imageData) && !empty($imageData))
 	   $image = $this->base64ToImage($imageData);
      
	$uuid = $this->get_uuid();
	
	$insertArr = [
	    'id' => $uuid,
            'name' => $request->name ?? "",
	    'user_type' => $request->user_type,
	    'email' => $request->email,
	    'permission_id' => $request->permission_id,
	    'phone_no' => $request->phone_no,	    
            'password'=> md5($request->password),
	    'status'=> $request->status ?? 'Active',
        ];
	
	
	if($request['user_type']=='Partner'){
		$insertArr['dealer_id'] = $request->dealer_id;
		$insertArr['organization'] = $request->organization;
		$insertArr['address'] = $request->address;
		$insertArr['site_url'] = $request->site_url;
		$insertArr['country_id'] = $request->country_id;
		$insertArr['postal_code'] = $request->postal_code;
	}
	
	if(isset($imageData) && !empty($imageData))
	   $insertArr['image'] =  $image;
	
   
	 //Add User Data
         $user = User::create($insertArr);
	 
	 // Email Generate update Settings
	 $config = $this->SystemConfig("Create User");
	 $message = $config['description'] ?? "";
	 $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);

     
        $message = (str_replace('<Email>' , $insertArr['email'] , $message));
	$message = (str_replace('<Password>' , $request->password , $message));
	$message = (str_replace('<Link>' , '<a href="'.env("SITE_URL").'">'.env("SITE_ADDRESS").'</a>' , $message));
	 
	  $data = [
	        'email' => $insertArr['email'],
	    	'name' => 'Welcome '.$insertArr['name'],
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
	
       
        $user  = User::where('id',$id)->first();
        $user->name  = $request->name ?? "";
	$user->user_type = $request->user_type;
	$user->email = $request->email;
	$user->permission_id = $request->permission_id;
	$user->phone_no = $request->phone_no;

	
	if($request['user_type']=='Partner'){
	        $user->country_id = $request->country_id;
		$user->dealer_id = $request->dealer_id;
		$user->organization = $request->organization;
		$user->site_url = $request->site_url;
		$user->postal_code = $request->postal_code;
		$user->address = $request->address;
	}
	
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
	$user->status = $request->status;
    
	$user->address = $request->address;
	 if(!empty($request->password)){
	    $user->password = md5($request->password);
	 }
	
	  $user->update();		
		

         return $this->jsonResponse(['user_id'=>$id],200,"Update User Successfully!");
    }
    public function delete($id,Request $request)
    {  
	if(!isPermission('delete','user',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
    	 $user  = User::where('id',$id)->first();
	 
	 if(!$user) return $this->jsonResponse(['user_id'=>$id],404,"User Not Found!");
	 
	 $user->is_deleted=1;
	 $user->save();
	 return $this->jsonResponse(['user_id'=>$id],200,"Delete User Successfully!");
    }
    public function bulkDelete(Request $request) {
    
    	if(!isPermission('delete','user',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
        try {
            if (isset($request->user_ids) && !empty($request->user_ids) && is_array($request->user_ids)) {
                foreach ($request->user_ids as $user_id) {
                    $user = User::where(['id' => $user_id])->first();
		    $user->is_deleted = 1;
		    $user->update();
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
