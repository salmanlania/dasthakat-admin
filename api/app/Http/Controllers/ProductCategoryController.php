<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class ProductCategoryController extends Controller
{
	protected $db;
	
    public function index(Request $request)
    {
  	
     $name = $request->input('name','');
	 $search = $request->input('search','');
	 $page =  $request->input('page', 1); // Default to page 2 if not specified
	 $perPage =  $request->input('limit', 10); // Default to 10 if not specified
	 $sort_column = $request->input('sort_column','product_categories.created_at');
     $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';

     $category = ProductCategory::where('product_categories.is_deleted',0);
	 if(!empty($name)) $category = $category->where('product_categories.name', 'like', '%'.$name.'%');
	 
	 	if (!empty($search)) {
            $search = strtolower($search);
            $category = $category->where(function ($query) use ($search){		       	       
		          $query->where('product_categories.name', 'like', '%' . $search . '%');
	      });      
        }
	  
	    $category = $category->select('product_categories.*');
	    $category = $category->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $category);
    }
    
    
    
    public function show($id, Request $request)
    {
    	if (!isPermission('edit', 'product-category', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$category =  ProductCategory::where('id',$id)->first();
		return $this->jsonResponse($category, 200, "Product Category Data");
    }

  
    public function validateRequest($request, $id = null)
    {
		$rules = [
		    'name' => [
	            'required',
		    'string',
		     Rule::unique('product_categories')->where('is_deleted',0)->ignore($id)
		     ]
		 ];

		$validator = Validator::make($request, $rules);
		$response = [];
		if ($validator->fails()) {
			$response = $errors = $validator->errors()->all();
			$firstError = $validator->errors()->first();
			return $firstError;

		}
		return [];
	}

    public function store(Request $request)
	{
		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError))
			return $this->jsonResponse($isError, 400, "Request Failed!");

		$uuid = $this->get_uuid();

		$insertArr = [
			'id' => $uuid,
			'name' => @$request->name,
			'created_by' => @$request->user_id
		];

		ProductCategory::create($insertArr);
		return $this->jsonResponse(['product_category_id' => $uuid], 200, "Add Product Category Successfully!");
	}

	public function update(Request $request, $id)
	{
		// Validation Rules
		$isError = $this->validateRequest($request->all(),$id);
		if (!empty($isError))
			return $this->jsonResponse($isError, 400, "Request Failed!");
       
       $category  = ProductCategory::where('id',$id)->first();
       $category->name  = $request->name ?? "";
	   $category->update();
	}

	public function delete($id,Request $request)
    {  
	   if (!isPermission('delete', 'product-category', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		
    	$category  = ProductCategory::where('id',$id)->first();
	    if(!$category) return $this->jsonResponse(['product_category_id'=>$id],404,"Product Category Not Found!");

	    // Check Product Category In Porduct Setup
	    $product = Product::where('product_category_id',$id)->where('is_deleted',0)->count();
	    if($product > 0) return $this->jsonResponse(['product_category_id'=>$id],404," Row Exist Aganist This Reocrd, Delete Restrict!");
	    	
	 	$category->is_deleted=1;
	 	$category->save();
	    return $this->jsonResponse(['product_category_id'=>$id],200,"Delete Product Category Successfully!");
    }
    public function bulkDelete(Request $request) {
    
    	if (!isPermission('delete', 'product-category', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		
        try {
            if (isset($request->product_category_ids) && !empty($request->product_category_ids) && is_array($request->product_category_ids)) {
                foreach ($request->product_category_ids as $product_category_id) {
                    $category = ProductCategory::where(['id' => $product_category_id])->first();

                     // Check Product Category In Porduct Setup
		    		$product = Product::where('product_category_id',$product_category_id)->where('is_deleted',0)->count();
		    		if($product==0){
		    				$category->is_deleted = 1;
		    				$category->update();
		    		}
                }
            }
	    
	      return $this->jsonResponse('Deleted',200,"Delete Product Category successfully!");
        } catch (\Exception $e) {
	    return $this->jsonResponse('some error occured',500,$e->getMessage());
        }  
    }
    


}
