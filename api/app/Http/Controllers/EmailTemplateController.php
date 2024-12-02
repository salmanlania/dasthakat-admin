<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class EmailTemplateController extends Controller
{
	 protected $db;
    
    public function index(Request $request)
    {
        

	 $get = $request->all();
	 $module =  $request->input('module','');
	 
	 $search = $request->input('search','');
	 $page =  $request->input('page', 1); // Default to page 2 if not specified
	 $perPage =  $request->input('limit', 10); // Default to 10 if not specified
	 $sort_column = $request->input('sort_column','setting.created_at');
         $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';

         $setting = Setting::where('module','<>','general');
	 $setting = $setting->where('module','<>','gl');
	 
	 	// Search Box
		if (!empty($search)) {
			$search = strtolower($search);
			$setting = $setting->where(function ($query) use ($search){		       
			    $query->where('module', 'like', '%' . $search . '%');
			});
		}
	
	 $setting = $setting->groupBy('module')->select('setting.*');
	 $setting =  $setting->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $setting);
    }
    
    public function show($id,Request $request)
    {
	// if(!isPermission('edit','parlour-master',$request->permission_list)) 
	 //	return $this->jsonResponse('Permission Denied!',403,"No Permission");
	
	 $id = str_replace('-',' ',$id);
         $setting = Setting::where('module',$id)->orderBy('field','desc')->get();
         return $this->jsonResponse($setting,200,"Setting Data");
    }
    
     public function validateRequest($request,$id=null) 
     {
      $rules = [
	  'module' => [
	            'required',
		     Rule::unique('setting')->where('module',$request['module'])->ignore($id)
		     ]
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
      

	foreach($request->details as $key => $row){
	
		 $uuid = $this->get_uuid();
		Setting::create([
		    'id' => $uuid,
		    'module' => $request->module,
		    'field' => $row['field'],
		    'value' => $row['value'],
	        ]);
	
	}
	
	
         return $this->jsonResponse(['module'=>$request->module],200,"Add Email Template Successfully!");
    }
    
    public function update( Request $request,$id)
    {   
       // Validation Rules
      // $isError = $this->validateRequest($request->all(),$id);
      // if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
      
        $id = str_replace('-',' ',$id);
        Setting::where('module',$id)->delete();
        foreach($request->details as $key => $row){
	
	       $uuid = $this->get_uuid();
		Setting::create([
		    'id' => $uuid,
		    'module' => $request->module,
		    'field' => $row['field'],
		    'value' => $row['value'],
	        ]);
	
	}

         return $this->jsonResponse(['module'=>$id],200,"Update Email Template Successfully!");
    }
    public function delete($id,Request $request)
    {  
    
       //	if(!isPermission('delete','parlour-master',$request->permission_list)) 
	 //	return $this->jsonResponse('Permission Denied!',403,"No Permission");
	
	 $id = str_replace('-',' ',$id);
    	 $setting  = Setting::where('module',$id)->delete();
	 return $this->jsonResponse(['module'=>$id],200,"Delete Email Template Successfully!");
    }
    

 
}
