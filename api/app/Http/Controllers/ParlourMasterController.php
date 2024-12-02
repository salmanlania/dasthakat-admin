<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\ParlourMaster;
use App\Models\QuoteRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ParlourMasterController extends Controller
{
	 protected $db;
    
    public function index(Request $request)
    {
        
	if(!isPermission('list','parlour-master',$request->permission_list) && isset($request->check_permission)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
	 $get = $request->all();
         $name = $request->input('name','');
	 $module_id =  $request->input('module_id','');
	 
	 $search = $request->input('search','');
	 $page =  $request->input('page', 1); // Default to page 2 if not specified
	 $perPage =  $request->input('limit', 10); // Default to 10 if not specified
	 $sort_column = $request->input('sort_column','parlour_master.created_at');
     $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';

     $parlourMasters = ParlourMaster::join('parlour_module', 'parlour_master.module_id', '=', 'parlour_module.id');
	 $parlourMasters = $parlourMasters->where('parlour_master.is_deleted',0);
	 if(!empty($name)) $parlourMasters = $parlourMasters->where('parlour_master.name', 'like', '%'.$name.'%');
	 if(!empty($module_id)) $parlourMasters = $parlourMasters->where('module_id', '=', $module_id);
	 
	 if (!empty($search)) {
            $search = strtolower($search);
              $parlourMasters = $parlourMasters->where('parlour_master.name', 'like', '%' . $search . '%');
		  
         }
	  
	 $parlourMasters = $parlourMasters->select('parlour_master.*','parlour_module.name as module_name');
	 $parlourMasters =  $parlourMasters->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $parlourMasters);
    }
    
    public function show($id,Request $request)
    {
	if(!isPermission('edit','parlour-master',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
         $parlourMaster = ParlourMaster::with('parlour_module:id,name')->where('id',$id)->first();
         return $this->jsonResponse($parlourMaster,200,"Parlour Master Data");
    }
    
     public function validateRequest($request,$id=null) 
     {
      $rules = [
	  'name' => [
	            'required',
		     Rule::unique('parlour_master')->where('module_id',$request['module_id'])->where('is_deleted',0)->ignore($id)
		     ],
	  'module_id' => 'required'
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
      
	$uuid = $this->get_uuid();

        ParlourMaster::create([
	    'id' => $uuid,
            'name' => trim($request->name),
	    'module_id' => $request->module_id,
	    
        ]);
         return $this->jsonResponse(['parlour_master_id'=>$uuid],200,"Add Parlour Master Successfully!");
    }
    
    public function update( Request $request,$id)
    {   
       // Validation Rules
       $isError = $this->validateRequest($request->all(),$id);
       if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
       
        $parlourMaster  = ParlourMaster::where('id',$id)->first();
        $parlourMaster->name  = trim($request->name);
	$parlourMaster->module_id = $request->module_id;
	$parlourMaster->save();

         return $this->jsonResponse(['parlour_master_id'=>$id],200,"Update Parlour Master Successfully!");
    }
    public function delete($id,Request $request)
    {  
    
       	if(!isPermission('delete','parlour-master',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");
	

    	 $parlourMaster  = ParlourMaster::with('parlour_module')->where('id',$id)->first();
	 if(!$parlourMaster) return $this->jsonResponse(['id'=>$id],404,"Parlour Master Not Found!");
	 
	$master_id = $this->getPotalMasterId($parlourMaster->parlour_module->name);
	 $name = $parlourMaster->parlour_module->name;
	 if($name=='Milk Pump'){
	     $name = 'Delivery Milk Pump';
	 }
	 
	 $quoteRequest  = QuoteRequest::where('is_deleted',0);
	 $quoteRequest = $quoteRequest->where($master_id,$id);
	 if($name =='Delivery Milk Pump')
	 	$quoteRequest = $quoteRequest->orWhere($master_id,$id);
	 $quoteRequest = $quoteRequest->first();
	 if(!empty($quoteRequest)) return $this->jsonResponse("Document Exist Aganist this Parlor Master!",404,"Document Exist Aganist this Parlor Master!");
		
	 $parlourMaster->is_deleted=1;
	 $parlourMaster->save();
	 return $this->jsonResponse(['parlour_master_id'=>$id],200,"Delete Parlour Master Successfully!");
    }
    
    public function getPotalMasterId($name)
    {
          $str = str_replace(' ','_',strToLower($name));
	  $str = preg_replace("/s\b/", "", $str);
	  $master_id = $str.'_id';
	  return $master_id;
    }
    
    public function bulkDelete(Request $request) {
    
    
       if(!isPermission('delete','parlour-master',$request->permission_list)) 
	 	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		    
        
        try {
            if (isset($request->parlour_master_ids) && !empty($request->parlour_master_ids) && is_array($request->parlour_master_ids)) {
                foreach ($request->parlour_master_ids as $parlour_master_id) {
                    $parlourMaster = ParlourMaster::with('parlour_module')->where(['id' => $parlour_master_id])->first();
		    $name = $parlourMaster->parlour_module->name;
		    if($parlourMaster->parlour_module->name=='Milk Pump'){
		    	 $name = 'Delivery Milk Pump';
		    }
		    $master_id = $this->getPotalMasterId($name);
		    $quoteRequest  = QuoteRequest::where('is_deleted',0);
		     $quoteRequest = $quoteRequest->where($master_id,$parlour_master_id);
		     if($name =='Delivery Milk Pump')
		     	$quoteRequest = $quoteRequest->orWhere($master_id,$parlour_master_id);
		     $quoteRequest = $quoteRequest->first();
		    if(empty($quoteRequest)){
		    	$parlourMaster->is_deleted = 1;
		    	$parlourMaster->update();
		    }
                }
            }
	    
	    return $this->jsonResponse('Deleted',200,"Delete Parlour Masters successfully!");
        } catch (\Exception $e) {
	    return $this->jsonResponse('some error occured',500,$e->getMessage());
        }  
    }
    

}
