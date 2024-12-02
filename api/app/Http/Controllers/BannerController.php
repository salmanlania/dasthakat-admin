<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class BannerController extends Controller
{
	protected $db;
    public function show($id,Request $request)
    {
         $banner = Banner::first();
         return $this->jsonResponse($banner,200,"Banner");
    }
    
    public function store(Request $request)
    {  
        $image = "";
	if (isset($request->image) && !empty($request->image))
		   $image = $this->base64ToImage($request->image, 'public/banners/', 'A1');

	
	if(!empty($image)){
	        Banner::where('id','!=',0)->delete();	   
	        Banner::create([
	            'image' =>  (!empty($image) ? $image : ''),
		        'path' => 'banners/',	    
		        'type' => json_encode($request->user_type),	    
	        ]);
	}else{
	    $banner = Banner::first();
	    $banner->type = json_encode($request->user_type);
	    
	    if(!empty($request->old_image))
	    	$banner->image = "";
		
	    $banner->update();
	}
	
	if(@$request->old_image && file_exists('public/banners/'.$request->old_image))
	       unlink('public/banners/'.$request->old_image);
	    
	    
         return $this->jsonResponse('Banner Image',200,"Add Banner Image Successfully!");
    }


}
