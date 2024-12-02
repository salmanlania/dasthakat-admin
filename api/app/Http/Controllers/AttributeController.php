<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Attributes;
use App\Models\ProductAttributes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AttributeController extends Controller
{
	 protected $db;
    
    public function index(Request $request)
    {
        
	 if(!isPermission('list','attribute',$request->permission_list) && isset($request->check_permission)) 
	  	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
	 $name = $request->input('name',''); 
	 $search = $request->input('search','');
	 $page =  $request->input('page', 1); // Default to page 2 if not specified
	 $perPage =  $request->input('limit', 10); // Default to 10 if not specified
	 $sort_column = $request->input('sort_column','attributes.created_at');
     $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';

     $attributes = Attributes::where('attributes.is_deleted',0);
	 if(!empty($name)) $attributes = $attributes->where('attributes.name', 'like', '%'.$name.'%');
	 
	 if (!empty($search)) {
            $search = strtolower($search);
              $attributes = $attributes->where('attributes.name', 'like', '%' . $search . '%');
		  
         }
	 
	 $attributes =  $attributes->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $attributes);
    }
    
    public function show($id,Request $request)
    {
	   if(!isPermission('edit','attribute',$request->permission_list)) 
	    	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
         $attribute = Attributes::where('id',$id)->first();
         return $this->jsonResponse($attribute,200,"Attribute Data");
    }
    
     public function validateRequest($request,$id=null) 
     {
      $rules = [
	  'name' => [
	            'required',
		     Rule::unique('attributes')->where('is_deleted',0)->ignore($id)
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
      
        Attributes::create([
            'name' => trim($request->name),
        ]);
         return $this->jsonResponse("Add Attribute",200,"Add Attribute Successfully!");
    }
    
    public function update( Request $request,$id)
    {   
       // Validation Rules
       $isError = $this->validateRequest($request->all(),$id);
       if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
       
        $attribute  = Attributes::where('id',$id)->first();
        $attribute->name  = trim($request->name);
	$attribute->save();

         return $this->jsonResponse(['attribute_id'=>$id],200,"Update Attribute Successfully!");
    }
    public function delete($id,Request $request)
    {  
    
       if(!isPermission('delete','attribute',$request->permission_list)) 
	 		return $this->jsonResponse('Permission Denied!',403,"No Permission");
	

    	$attribute  = Attributes::where('id',$id)->first();
	    if(!$attribute) return $this->jsonResponse(['id'=>$id],404,"Attribute Not Found!");
	 
	 $productAttribute = ProductAttributes::where('attribute_id',$id)->first();
	 if(!empty($productAttribute)) return $this->jsonResponse("Document Exist Aganist this Attribute!",404,"Document Exist Aganist this Attribute!");
		
	 $attribute->is_deleted=1;
	 $attribute->save();
	 return $this->jsonResponse(['attribute_id'=>$id],200,"Delete Attribute Successfully!");
    }
    
    
    public function bulkDelete(Request $request) {
    
    
       if(!isPermission('delete','attribute',$request->permission_list)) 
	 		return $this->jsonResponse('Permission Denied!',403,"No Permission");
		    
        
        try {
            if (isset($request->attribute_ids) && !empty($request->attribute_ids) && is_array($request->attribute_ids)) {
                foreach ($request->attribute_ids as $attribute_id) {
                    $attribute = Attributes::where('id',$attribute_id)->first();
		    
		    $productAttribute = ProductAttributes::where('attribute_id',$attribute_id)->first();
		    if(empty($productAttribute )){
		    	$attribute->is_deleted = 1;
		    	$attribute->update();
		    }
                }
            }
	    
	    return $this->jsonResponse('Deleted',200,"Delete Attributes successfully!");
        } catch (\Exception $e) {
	    return $this->jsonResponse('some error occured',500,$e->getMessage());
        }  
    }
    

}
