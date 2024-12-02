<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariants;
use App\Models\ProductAttributes;
use App\Models\ProductVariantAttributes;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use DB;

class ProductController extends Controller
{
	protected $db;
	
    public function index(Request $request)
    {
        if (!isPermission('list', 'product', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
    
         $name = $request->input('name','');
	 $product_category_id = $request->input('product_category_id','');
	 $status = $request->input('status','');
	 $search = $request->input('search','');
	 $page =  $request->input('page', 1); // Default to page 2 if not specified
	 $perPage =  $request->input('limit', 10); // Default to 10 if not specified
	 $sort_column = $request->input('sort_column','products.created_at');
         $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';

         $item = Product::leftJoin('product_categories as pc', 'pc.id', '=', 'products.product_category_id');
	 $item = $item->where('products.is_deleted',0);
	 if(!empty($name)) $item = $item->where('products.name', 'like', '%'.$name.'%');
	 if(!empty($product_category_id)) $item = $item->where('products.product_category_id', $product_category_id);
	 if($status !="") $item = $item->where('products.status', '=', $status);
	
	 
	 if (!empty($search)) {
            $search = strtolower($search);
            $item = $item->where(function ($query) use ($search){		       	       
		$query->where('products.name', 'like', '%' . $search . '%')
		->orWhere('pc.name', 'like', '%' . $search . '%');
				
	      });
				      
         }
	  
	 $item = $item->select('products.id','products.name','pc.name as product_category','status','products.created_at',DB::raw('(SELECT concat(path,image) FROM product_images WHERE product_images.product_id = products.id LIMIT 1) as image_url'));
	 $item = $item->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $item);
    }
    
    
    
    public function show($id, Request $request)
    {
    	if (!isPermission('edit', 'product', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

	  $product = Product::with('images')->leftJoin('product_categories as pc', 'pc.id', '=', 'products.product_category_id');
	  $product = $product->where('products.id',$id);
	  $product = $product->select('products.*','pc.name as product_category')->first();
	  
	  $product['product_attributes'] = ProductAttributes::where('product_id', $id)->orderBy('sort_order')->get();
	  $product_variant_attributes = ProductVariantAttributes::where('product_id', $id)->orderBy('variant_id')->get();
	  $pdVariantAttrs = [];
	  $pdVariantAttrs['attributes'] = [];
	  
	  
	  $a = [];
	  $arrList = [];
	  $actArr = [];
	  $i=-1;
	  foreach($product_variant_attributes as $key => $value){
	  	
		if(!isset($a[$value['variant_id']])){
		   $variant = ProductVariants::where('product_id', $id)
		                  ->where('id',$value['variant_id'])->first();
		  
		    $i++;
		    
		     $arrList[$i][] = [
		   	'product_id' =>$id,
			'variant_id' =>$value['variant_id'],
			'attribute_id' =>'part_no',
			'attribute_name' =>'Part No',
			'attribute_value' =>$variant['part_number']
		   
		   ];
		   $arrList[$i][] = [
		        'product_id' =>$id,
			'variant_id' =>$value['variant_id'],
			'attribute_id' =>'price',
			'attribute_name' =>'Price',
			'attribute_value' =>$variant['price']
		   
		   ];
		    $a[$value['variant_id']] = $value['variant_id'];
	         }
		 
		 
		 $arrList[$i][]  =$value;
		 
		 
	 
	  
	  }
	  
	  $product['product_variant_attributes'] = $arrList;
	 
	  return $this->jsonResponse($product, 200, "Product Data");
    }
    
    public function validateRequest($request,$id=null) 
     {
      $rules = [
	  'name' => [
	            'required',
		     Rule::unique('products')->where('is_deleted',0)->ignore($id)
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
      
		$uuid = $this->get_uuid();
		$post = $request->all();
		$insertArr = [
			'id' => $uuid,
			'name' => @$request->name,
			'product_category_id' => @$request->product_category_id,
			'summary' => @$request->summary,
			'description' => @$request->description,
			'label_tags' => @$request->label_tags,
			'schedule_date' => @$request->schedule_date,
			'schedule_time' => @$request->schedule_time,
			'status' => @$request->status,
			'created_by' => @$request->user_id,
		];
		
		if(!empty($request->is_published))
		   $insertArr['is_published']  = $request->is_published ?? "";

		Product::create($insertArr);


		//Add Multiple Attributes
		if(!empty(@$post['attributes']))
		foreach($post['attributes'] as $key => $row){
			$uuid = $this->get_uuid();
			$insertAttribute = [
				'id' => $uuid,
				'product_id' => $insertArr['id'],
				'attribute_id' => @$row['attribute_id'],
				'attribute_name' => @$row['attribute_name'],
				'sort_order' => $key+1
			];
			ProductAttributes::create($insertAttribute);
		}


		//Add Multiple images
		if(!empty($request->images))
		foreach($request->images as $key => $row){
		 
		 	$image = '';
			if(!empty($row))
			   $image = $this->base64ToImage($row, 'public/products/', 'A' . ($key + 1));
				
			   $uuid = $this->get_uuid();
			   $insImage = [
				'id' => $uuid,
				'product_id' => $insertArr['id'],
				'image' => (!empty($image) ? $image : $data['old_images'][$key]),
				'path' => 'products/',
			  ];
			  ProductImage::create($insImage);
		}
		
		
		$product_attrribute = ProductAttributes::where('product_id', $insertArr['id'])->orderBy('sort_order')->get();
		return $this->jsonResponse(['product_id' =>  $insertArr['id'],'product_attrribute'=>$product_attrribute], 200, "Add Product Successfully!");
	}
	
	
	public function update($id,Request $request)
	{
	
		
       	       $product  = Product::where('id',$id)->first();
		if(empty($product)) return $this->jsonResponse(['product_id'=>$id],404,"Product Not Found!");
		 
	    if($request->tab_no==1){
	    
	    $post = $request->all();
	    $attributes = @$post['attributes'];
	    
	    // Validation Rules
        // $isError = $this->validateRequest($request->all(),$id);
      //  if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
	
       	        $product->name  = $request->name ?? "";
		$product->product_category_id  = $request->product_category_id ?? "";
		$product->summary  = $request->summary ?? "";
		$product->description  = $request->description ?? "";
		$product->label_tags  = $request->label_tags ?? "";
		$product->schedule_date  = $request->schedule_date ?? "";
		$product->schedule_time  = $request->schedule_time ?? "";
		$product->status  = $request->status ?? "";
	    
		if(!empty($request->is_published))
			$product->is_published  = $request->is_published ?? "";
		
		$product->updated_by  = $request->user_id ?? "";
	   	$product->update();

	   	//Add Multiple Attributes
		if(!empty($attributes)){ 

			ProductAttributes::where('product_id',$id)->delete();
			foreach($attributes as $key => $row){

			       	$uuid = $this->get_uuid();
				$insertAttribute = [
					'id' => $uuid,
					'product_id' => $id,
					'attribute_id' => @$row['attribute_id'],
				        'attribute_name' => @$row['attribute_name'],
					'sort_order' => $key+1
				];
				ProductAttributes::create($insertAttribute);
			}
		}
		
		
		//Add Multiple images
		if(!empty($request->images)){
		   ProductImage::where('product_id',$id)->delete();
		
			foreach($request->images as $key => $row){
			
			 	$image = '';
				if(!empty($row) && !file_exists('public/products/'.$row))
				   $image = $this->base64ToImage($row, 'public/products/', 'A' . ($key + 1));
				
				
					$uuid = $this->get_uuid();
					$insImage = [
					   'id' => $uuid,
					   'product_id' => $id,
					   'image' => (!empty($image) ? $image :  $row),
					   'path' => 'products/',
					   'sort_order' => ($key+1),
					];
						
				  ProductImage::create($insImage);
			}
	       }
	       
	       //Delete Images
		if(!empty($request->deleted_images))
		foreach($request->deleted_images as $key => $row){
		     if(file_exists('public/products/'.$row))
			unlink('public/products/'.$row);
		}
		
	     }else{
	     
	     
	      if(!empty($request->is_published))
			$product->is_published  = $request->is_published ?? "";
		
		$product->updated_by  = $request->user_id ?? "";
	   	$product->update();
	     
	       	//Add Product Variants
		
		if(!empty($request->product_variants)){
			ProductVariants::where('product_id',$id)->delete();
			ProductVariantAttributes::where('product_id',$id)->delete();
			
			foreach($request->product_variants as $key => $row){
			
				 $uuid = $this->get_uuid();
				$insVariant = [
					'id' => @$row['id'] ?? $uuid,
					'product_id' => $row['product_id'],
					'part_number' =>  $row['attributes'][0]['value'] ?? '',
					'price' => $row['attributes'][1]['value'] ?? '0',
					'sort_order' => ($key+1),
					'created_by' =>  @$request->user_id,
				];
				ProductVariants::create($insVariant);
				
				foreach($row['attributes'] as $i => $attr){
				
					if($attr['attribute_id']=='price' || $attr['attribute_id']=='part_no') continue;
					
					$uuid = $this->get_uuid();
					$insAttVariant = [
						'id' => $uuid,
						'product_id' => $row['product_id'],
						'variant_id' => $insVariant['id'],
						'attribute_id' =>  $attr['attribute_id'] ?? '',
						'attribute_name' => $attr['attribute_name'] ?? '',
						'attribute_value' => $attr['value'] ?? '',
					];
				
					ProductVariantAttributes::create($insAttVariant);
				}
		
			}
		}
		
	    }
		
		
		
		$product_attribute = ProductAttributes::where('product_id', $id)->orderBy('sort_order')->get();
		return $this->jsonResponse(['product_id' => $id,'product_attrribute'=>$product_attribute], 200, "Update Product Successfully!");
	}
	
	
   public function delete($id, Request $request)
   {
	    // Check if the user has permission to delete a product
	    if (!isPermission('delete', 'product', $request->permission_list)) {
	        return $this->jsonResponse('Permission Denied!', 403, "No Permission");
	    }

	    // Find the product by ID
	    $product = Product::where('id', $id)->first();
	    if (!$product) {
	        return $this->jsonResponse(['product_id' => $id], 404, "Product Not Found!");
	    }

	    // Check if the product is associated with any order details
	    $isExist = OrderDetail::where('product_id', $id)->count();
	    if ($isExist > 0) {
	        return $this->jsonResponse(['product_id' => $id], 403, "Product cannot be deleted as it is linked to existing orders.");
	    }

	    // Proceed with deletion if no order details are found
	    ProductAttributes::where('product_id', $id)->delete();
	    $product->is_deleted = 1;
	    $product->save();

	    return $this->jsonResponse(['product_id' => $id], 200, "Product deleted successfully!");
    }
    public function bulkDelete(Request $request) {
    
    	if(!isPermission('delete','product',$request->permission_list)) 
	 		return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
        try {
            if (isset($request->product_ids) && !empty($request->product_ids) && is_array($request->product_ids)) {
                foreach ($request->product_ids as $product_id) {
		
		    $isExist = OrderDetail::where('product_id',$product_id)->count();
		    if($isExist==0){
                       $product = Product::where(['id' => $product_id])->first();
		       ProductAttributes::where('product_id',$product_id)->delete();
		       $product->is_deleted = 1;
		       $product->update();
		     }
		     
                }
            }
	    
	      return $this->jsonResponse('Deleted',200,"Delete Product Successfully!");
        } catch (\Exception $e) {
	    return $this->jsonResponse('some error occured',500,$e->getMessage());
        }  
    }

}
