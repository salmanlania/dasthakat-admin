<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariants;
use App\Models\ProductAttributes;
use App\Models\ProductVariantAttributes;
use App\Models\Favorite;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use DB;

class ShopController extends Controller
{
	protected $db;
	
    public function index(Request $request)
    {
    	        $name = $request->input('name','');
		$productCategoryId = $request->input('product_category_id','');
		$labelTags = $request->input('label_tags','');
		$userId = $request->input('user_id','');
		$status = $request->input('status','');
		$search = $request->input('search','');
		$favorite = $request->input('favorite','');
		$page =  $request->input('page', 1); // Default to page 2 if not specified
		$perPage =  $request->input('limit', 9); // Default to 9 if not specified
		
		$sort_column = $request->input('sort_column','name');
	        $sort_direction = ($request->input('sort_direction')=='asc') ? 'asc' : 'desc';

	         $item = Product::leftJoin('favourites as fv', function ($join) use ($userId) {
		        $join->on('fv.product_id', '=', 'products.id')
		             ->where('fv.created_by', '=', $userId);
		 });
		 $item = $item->where('products.is_deleted',0);
		 $item = $item->where('products.is_published',1);
		 $item = $item->where('status',1);
		 
		 if($favorite==1) $item = $item->whereNotNull('fv.product_id');
		 if(!empty($productCategoryId)) $item = $item->where('product_category_id',$productCategoryId );
		 if(!empty($labelTags)) $item = $item->where('label_tags', 'like', '%'.$labelTags.'%');
		 if(!empty($name)) $item = $item->where('products.name', 'like', '%'.$name.'%');
		 
		 if (!empty($search)) {
	            $search = strtolower($search);
	            $item = $item->where(function ($query) use ($search){		       	       
			$query->where('products.name', 'like', '%' . $search . '%');			
		      });	      
	         }
		  
		 $item = $item->select('products.id','products.name','summary',DB::raw('(if(fv.product_id is NULL,0,1)) as favorite'),DB::raw('(SELECT concat(path,image) FROM product_images WHERE product_images.product_id = products.id LIMIT 1) as image_url'));
		 $item = $item->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $item);

    }
    
    public function addToFavorite(Request $request)
    {
	Favorite::where('product_id',$request->product_id)->where('created_by',$request->user_id)->delete();
	if(@$request->is_favorite==1){
		$uuid = $this->get_uuid();
		$insertArr = [
			'id' => $uuid,
			'product_id' => @$request->product_id,
			'created_by' => @$request->user_id
		];

        Favorite::create($insertArr);
	return $this->jsonResponse("Add Favorite", 200, "Add Favorite Successfully!");
       }else
	return $this->jsonResponse("Update", 200, "Update Successfully!");
    }
    
    public function productDetail($id ,Request $request)
    {
        $userId = $request->input('user_id','');
	$product = Product::with('images');
	$product = $product->join('product_categories as pc', 'pc.id', '=', 'products.product_category_id');
	$product = $product->leftJoin('favourites as fv', function ($join) use ($userId) {
		        $join->on('fv.product_id', '=', 'products.id')
		             ->where('fv.created_by', '=', $userId);
		 });
	$product = $product->where('products.id',$id);
	$product = $product->select('products.*','pc.name as product_category',DB::raw('(if(fv.product_id is NULL,0,1)) as favorite'))->first();
	
	
	
	$product['product_attributes'] = ProductAttributes::where('product_id', $id)->orderBy('sort_order')->get();
	  $product_variant_attributes = ProductVariantAttributes::where('product_id', $id)->orderBy('variant_id')->get();
	  $pdVariantAttrs = [];
	  $pdVariantAttrs['attributes'] = [];
	  
	  
	  $variantArr = [];
	  $arrList = [];
	  $actArr = [];
	  $i=-1;
	  foreach($product_variant_attributes as $key => $value){
	  	
		if(!isset($variantArr[$value['variant_id']])){
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
		    $variantArr[$value['variant_id']] = $value['variant_id'];
	         }
		 
		 $arrList[$i][]  =$value;
		 
	  
	  }
	  
	  $product['product_variant_attributes'] = $arrList;
	  
	return $this->jsonResponse($product, 200, "Product Data");
    }
    public function addToCart(Request $request)
    {
    
    	$userId = $request->input('user_id', '');
	$productId = $request->input('product_id', '');

	foreach ($request->carts as $cartItem) {
	    $variantId = $cartItem['id']; // variant id is id 
	    $price = $cartItem['price'];
	    $qty = $cartItem['quantity'];

	    // Check Cart Detail for Single Variant
	    $cartData = Cart::where('product_id', $productId)
	                     ->where('variant_id', $variantId)
			     ->where('created_by', $userId)
	                     ->first();

	    if ($cartData) {
	        $cartData->quantity = $qty;
		$cartData->amount = $price * $qty;
	        $cartData->updated_by = $userId;
	        $cartData->save(); 
	    } else {
	        $this->addCartItem($productId, $variantId, $price, $qty, $userId);
	    }

	}
	
	return $this->jsonResponse(['product_id'=>$productId], 200, "Add to Cart Successfully!");
    }
    
    
    private function addCartItem($productId, $variantId, $price, $qty, $userId) {
	    $uuid = $this->get_uuid();
	    $cartInsert = [
	        'id' => $uuid,
	        'product_id' => $productId,
	        'variant_id' => $variantId,
	        'price' => $price,
	        'quantity' => $qty,
	        'amount' => $price * $qty,
	        'created_by' => $userId,
	    ];
	    Cart::create($cartInsert);
    }
    
    public function viewCart(Request $request)
    {
         $userId = $request->input('user_id', '');
         // Check Cart Detail for Single Variant
         $cartData = Cart::Join('product_variants as pv','pv.id', '=', 'product_cart.variant_id')
	                 ->Join('products as p','p.id', '=', 'product_cart.product_id')
	 		 ->where('product_cart.created_by', $userId )
			 ->select(
			'product_cart.*',
			'p.name',
			'pv.part_number as part_number',
			 DB::raw('(SELECT concat(path,image) FROM product_images pi WHERE product_cart.product_id = pi.product_id LIMIT 1) as image_url'))
			->orderBy('product_cart.created_at','desc')->get();

	return $this->jsonResponse($cartData, 200, "Update Cart Successfully!");
    }
    
    public function updateCart(Request $request)
    {
    	$id = $request->input('id', '');
    	$userId = $request->input('user_id', '');
	$qty = $request->input('quantity', '');

	    // Check Cart Detail for Single Variant
	    $cartData = Cart::where('id', $id)
	                     ->where('created_by', $userId)
	                     ->first();
			     	
			     
	    if (!empty($cartData)) {
	        $cartData->quantity = $qty;
		$cartData->amount = $cartData->price * $qty;
	        $cartData->updated_by = $userId;
	        $cartData->update(); 
	    }

	return $this->jsonResponse(['cart_id'=>$id], 200, "Update Cart Successfully!");
    }
    public function deleteCartItem($id,Request $request)
    {
	$userId = $request->input('user_id', '');
        $cartData = Cart::where('id', $id)
	                     ->where('created_by', $userId)
	                     ->delete();

	return $this->jsonResponse(['cart'=>$id], 200, "Delete Cart Item Successfully!");
    }
    
}