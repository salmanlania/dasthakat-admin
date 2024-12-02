<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\User;
use App\Models\UserPermission;
use App\Models\ControlAccess;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PermissionController extends Controller
{
	 protected $db;
    
    public function index(Request $request)
    {
	 $get = $request->all();
     $name = $request->input('name','');
	 $user_permission_id =  $request->input('user_permission_id','');
	 $description =  $request->input('description','');

	 $search = $request->input('search','');
	 $page =  $request->input('page', 1); // Default to page 2 if not specified
	 $perPage =  $request->input('per_page', 10); // Default to 10 if not specified
	 $sort_column = $request->input('sort_column','created_at');
     $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';

     $user_permission = UserPermission::where('is_deleted',0);

	 if(!empty($name)) $user_permission = $user_permission->where('name', 'like', '%'.$name.'%');
	 if(!empty($user_permission_id)) $user_permission = $user_permission->where('user_permission_id', '=', $user_permission_id);
	 if(!empty($description)) $user_permission = $user_permission->where('description', 'like', '%'.$description.'%');
	 
       if (!empty($search)) {
            $search = strtolower($search);
             $user_permission = $user_permission->where(function ($query) use ($search){		       	       
		$query->Where('name', 'like', '%' . $search . '%')
	    	    ->orWhere('description', 'like', '%' . $search . '%');
				
	      });
	      
         }
	  
	 	$user_permission = $user_permission->select('user_permission_id','name','description','created_at');
	 	$user_permission =  $user_permission->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $user_permission);
    }
    
    public function show($id)
    {
         

        $controls = ControlAccess::orderBy('sort_order','asc')->get();

        $userGroup = UserPermission::where('user_permission_id', $id)->first();
        if(empty($userGroup)) return $this->jsonResponse([],404,"User Permission Not Found!");

        $userGroup->permission = json_decode($userGroup->permission);

        $arrPermissions = [];
        foreach($controls as $permission) {

            $module_name = $permission->module_name;
            $form_name = $permission->form_name;
            $control_access_id = $permission->control_access_id;
            $route = $permission->route;
            $permission_id = $permission->permission_id;
            $permission_name = $permission->permission_name;
            $arrPermissions[$module_name][$form_name][] = [
                'control_access_id' => $control_access_id,
                'route' => $route,
                'permission_id' => $permission_id,
                'permission_name' => $permission_name,
                'selected' => (isset($userGroup->permission->$route->$permission_id)? $userGroup->permission->$route->$permission_id : 0),
            ];
        }

        $userGroup->permission = $arrPermissions;
        return $this->jsonResponse($userGroup,200,"User Permission!");


    }
    
    public function validateRequest($request,$id=null) 
     {
      $rules = [
          'name' => 'required|unique:user_permission,name,'.$id.',user_permission_id',
      ];
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
	
	$name  = $request->name;
	$permission  = $request->permission;
	$description = $request->description ?? "";
	
	if (!(isset($request->permission)) || empty($permission) || !is_array($permission))
	 return $this->jsonResponse( $isError,400,"Request Failed!");
	
	$uuid = $this->get_uuid();
	$userPermissionId = UserPermission::insertGetId([
		'user_permission_id'=>$uuid ,
		'name'=>$request->name,
		'description'=>$request->description,
		'permission'=>json_encode($request->permission),
		'created_at'=>date('Y-m-d H:i:s'),
	
	]);
	
	return $this->jsonResponse(['user_permission_id'=>$userPermissionId],200,"Add User Permission Successfully!");
    }
    
    public function update( Request $request,$id)
    {   
       // Validation Rules
       $isError = $this->validateRequest($request->all(),$id);
       if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
       
       
        $name  = $request->name;
	$permission  = $request->permission;
	$description = $request->description ?? "";
	
	if (!(isset($request->permission)) || empty($permission) || !is_array($permission))
	 return $this->jsonResponse( $isError,400,"Request Failed!");
	
	 $userPermission  = UserPermission::where('user_permission_id',$id)->first();
    
        $updateData = [];
        $userPermission->permission = json_encode($request->permission);
	$userPermission->name = $request->name;
	$userPermission->description = $request->description;
        $userPermission->updated_at = date('Y-m-d H:i:s');
	$userPermission->update();
	

         return $this->jsonResponse(['user_permission_id'=>$id],200,"Update User Permission Successfully!");
    }
    public function delete($id)
    {  
    	$userPermission  = UserPermission::where('user_permission_id',$id)->first();
	 
	 if(!$userPermission) return $this->jsonResponse(['user_permission_id'=>$id],404,"User Permission Not Found!");
	 
	 $userPermission->is_deleted=1;
	 $userPermission->save();
	 return $this->jsonResponse(['user_permision_id'=>$id],200,"Delete User Permission Successfully!");
    }

    /**
     * bulk delete user groups
     */
    public function bulkDelete(Request $request) {
        try {
            if (isset($request->user_permission_ids) && !empty($request->user_permission_ids) && is_array($request->user_permission_ids)) {
                foreach ($request->user_permission_ids as $user_permission_id) {
                    $permission = UserPermission::where(['user_permission_id' => $user_permission_id])->first();
		    $permission->is_deleted = 1;
		    $permission->update();
                }
            }

            return $this->jsonResponse('Deleted',200,"Delete User Permission successfully!");
        } catch (\Exception $e) {
	    return $this->jsonResponse('some error occured',500,$e->getMessage());
        }  
    }
    

}
