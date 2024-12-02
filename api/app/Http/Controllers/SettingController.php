<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class SettingController extends Controller
{
	protected $db;
    public function update(Request $request,$id)
    {  
    $post = $request->all();  
    foreach($post as $module_name => $data) {
         Setting::where('module',$module_name)->delete();
         if($module_name!='permission_list')
            
	    if(is_array($data) || is_object($data) )
            foreach($data as $field => $value) {

                $uuid = $this->get_uuid();
            	$iData = [
                	'id' =>  $uuid ,
                	'module' => $module_name,
                	"field" => $field,
                	"value" => $value,
            	];      
	        Setting::create($iData);
	       
            }
        }
         return $this->jsonResponse('Updated',200,"Update Setting Successfully!");
    }
    
    
    public function show($id, Request $request)
    {
	  $setting = Setting::where('module','general')->pluck('value','field');
	   $result = null;
	  if(!empty($setting)){
	    $result = $setting;
	  }
	  
	  
	  $model = new Setting();
	  $result['email_details'] = $model->getEmailKeys();
	   
	  return $this->jsonResponse($result, 200, "Setting Data");
    }
    public function EmailDubugging(Request $request)
    {
          $setting = Setting::where('module','general')->pluck('value','field');
	  if(empty($setting)) return $this->jsonResponse("Email Setting not Found.", 400, "Congiuration Missing!");
	  
          $data = [
	    	'name' => 'Welcome '.@$setting['display_name'],
		'subject' => 'Testing Email',
		'message' => 'Testing Email is Working!'];
	  $response = $this->sentMail($data);
	  if(!empty($response))
	     return $this->jsonResponse($response, 400, "Invalid Email / Congiuration!");
	  else
	     return $this->jsonResponse("Email Sent", 200, "Email Sent Successfully!");
    }
}
