<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariants;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use TCPDF;
use DB;

class OrderController extends Controller
{
	protected $db;
	
    public function index(Request $request)
    {
    	       if (!isPermission('list', 'order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
			
    	        $order_no = $request->input('order_no','');
		$order_date = $request->input('order_date','');
		$total_amount = $request->input('total_amount','');
		$status = $request->input('status','');
		$userId = $request->input('user_id','');
		$orderBy = $request->input('order_by','');
		$userType = $request->input('user_type','');
		
		$search = $request->input('search','');
		$page =  $request->input('page', 1); // Default to page 2 if not specified
		$perPage =  $request->input('limit', 9); // Default to 9 if not specified
		
		$sort_column = $request->input('sort_column','order_no');
	        $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';
		
		
		
		$order = Order::Join('user as u', 'u.id', '=', 'orders.created_by');
		$order = $order->where('orders.is_deleted',0);
		
		if(!empty($order_no)) $order = $order->where('order_no','LIKE', '%'.$order_no.'%');
		if(!empty($order_date)) $order = $order->where('order_date','LIKE', '%'.$order_date.'%');
		if(!empty($total_amount)) $order = $order->where('total_amount','LIKE', '%'.$total_amount.'%');
		if(!empty($status)) $order = $order->where('orders.status','LIKE', '%'.$status.'%');
		if($userType=="Internal" && !empty($orderBy)) $order = $order->where('orders.created_by','=', $orderBy);
	
	       if($userType!="Internal") $order = $order->where('orders.created_by', $userId);		
		    
	
		 if (!empty($search)) {
	            $search = strtolower($search);
	            $order = $order->where(function ($query) use ($search){		       	       
			     $query->where('orders.order_no', 'like', '%' . $search . '%')			
			     ->orWhere('orders.total_amount', 'like', '%' . $search . '%');			
		      });	      
	         }
		  
		 $order = $order->select('orders.*','u.name as user_name');
		 $order = $order->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $order);
    }
    
    
     public function show($id, Request $request)
     {	
	     $order = Order::with([
		    'order_detail',
		    'order_detail.product',
		    'order_detail.variant',
		    'order_detail.product.images',
		])
		->join('countries as c', 'c.id', '=', 'orders.country_id')
		->select('orders.*', 'c.name as country_name') // Adjust based on the columns you need
		->where('orders.id', $id)
		->first();
	    return $this->jsonResponse($order, 200, "Order Detail");
    }

    public function validateRequest($request, $id = null)
    {
		$rules = [
		    'first_name' => 'required',
		    'organization' => 'required',
		    'country_id' => 'required',
		    'phone_no' => 'required',
		    'postal_code' => 'required',
		    'address' => 'required',
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
       		
		$userId  = $request->input('user_id','');
		$first_name  = $request->input('first_name','');
		$last_name  = $request->input('last_name','');
		$full_name  = $first_name.' '.$last_name;
		$organization  = $request->input('organization','');
		$country_id = $request->input('country_id','');
		$phone_no = $request->input('phone_no','');
		$postal_code = $request->input('postal_code','');
		$address = $request->input('address','');
		$total_amount = $request->input('total_amount','0');
		

	// Start the transaction
	DB::beginTransaction();
	$orderId = $this->get_uuid();
	try {
		$maxCode = Order::max('document_no');
		
		$orderData = array(
			"id" =>$orderId,
			"order_no" =>'ORD-'.str_pad($maxCode + 1, 6, '0', STR_PAD_LEFT),
			"document_no" =>$maxCode + 1,
			"order_date" =>date('Y-m-d'),
			"first_name" =>$first_name,
			"last_name" =>$last_name,
			"full_name" =>$full_name,
			"organization" =>$organization,
			"country_id" => $country_id,
			"phone_no" =>$phone_no,
			"postal_code"=>$postal_code,
			"address"=> $address,
			"total_amount"=>$total_amount,
			"created_by"=>$userId 
		);
		Order::create($orderData);
		
	     //Detail Transaction
	      $cartDetail =Cart::Where('created_by',$userId)->get();
	     if(empty(@$cartDetail))  return $this->jsonResponse('Cart Detail Not Found!',400," Detail Not Found");
	     
	     $detailList = [];
	     foreach($cartDetail as $key => $detail){
	             $uuid = $this->get_uuid();
		     $orderDetail =  array(
				"id" =>$uuid,
				"order_id" =>$orderId,
				"product_id" =>$detail->product_id,
				"variant_id" =>$detail->variant_id,
				"quantity" =>$detail->quantity,
				"price" =>$detail->price,
				"amount" =>$detail->amount,
				"sort_order" => ($key+1)
			);
	         OrderDetail::create($orderDetail);
		 
		 $product = Product::Join('product_variants as pv','pv.product_id','=','products.id')->where('pv.id',$detail->variant_id)->first();
		 $orderDetail['product_name'] =  $product->name;
		 $orderDetail['part_number'] =  $product->part_number;
		 $detailList[] = $orderDetail; 
		
		 }
		Cart::Where('created_by',$userId)->delete();
		
		// Partner Info
		 $partner = User::where('id',$userId)->first();
		 
		  $orderDetail = [
		    'order' => $orderData,
		    'items' =>  $detailList, // Assuming 'items' is an array of items in the order
		];
		 $order_template = view('emails.order-email', compact('orderDetail'))->render();
		 
				  		
		 
		// Email Generate update Settings
		 $config = $this->SystemConfig("Order Creation");
		 $message = $config['description'] ?? "";
		 $subject = html_entity_decode($config['subject'] ?? "", ENT_QUOTES | ENT_HTML5);
		 $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);		 
					 
		 $subject = (str_replace('<Order ID>' , $orderData['order_no'] , $subject));
		 $message = (str_replace('<Table Order>' ,$order_template , $message));
		 
		 //Email for Order
		 $mailData = [];
		 $mailData['name'] = 'Dear '.$partner->name;			   
		 $mailData['email'] = $partner->email;
		 $mailData['subject'] = $subject;
		 $mailData['message'] = $message;
		 
		 $this->sentMail($mailData);
		 
	        // Commit the transaction
		DB::commit();
	    } catch (\Exception $e) {
		    // Roll back the transaction if anything failed
		    DB::rollBack();
		    return $this->jsonResponse('Failed to create order: ' . $e->getMessage(),400,"Invalid Order");
	    }
	
	   return $this->jsonResponse(['order_id'=>$orderId],200,"Order created Successfully!");
    }
    
    
    public function update($id,Request $request)
    {  
          $userId  = $request->input('user_id','');
	  $delivery_date  = $request->input('delivery_date','');
	  $remarks  = $request->input('remarks','');

	   $order =Order::Where('id',$id)->first();
	   $order->delivery_date = $delivery_date;
	   $order->remarks = $remarks;
	   $order->updated_by = $userId;
	   $order->update();
	   
	   return $this->jsonResponse(['order_id'=>$id],200,"Order created Successfully!");
    }
    
    
    public function buyAgain(Request $request)
    {  
	
	$userId  = $request->input('user_id','');
	$id  = $request->input('order_id','');
	$order = Order::Where('id',$id)->first();
		

	// Start the transaction
	DB::beginTransaction();
	$orderId = $this->get_uuid();
	try {
                
		$maxCode = Order::max('document_no');
		$orderData = array(
			"id" =>$orderId,
			"order_no" =>'ORD-'.str_pad($maxCode + 1, 6, '0', STR_PAD_LEFT),
			"document_no" =>$maxCode + 1,
			"order_date" =>date('Y-m-d'),
			"first_name" =>$order->first_name,
			"last_name" =>$order->last_name,
			"full_name" =>$order->full_name,
			"organization" =>$order->organization,
			"country_id" => $order->country_id,
			"phone_no" =>$order->phone_no,
			"postal_code"=>$order->postal_code,
			"address"=> $order->address,
			"total_amount"=>$order->total_amount,
			"created_by"=>$userId 
		);
		Order::create($orderData);
		
	     //Detail Transaction
	      $orderDetail =OrderDetail::Where('order_id',$id)->get();
	     if(empty(@$orderDetail))  return $this->jsonResponse('Order Detail Not Found!',400," Detail Not Found");
	     
	     $detailList =[];
	     foreach($orderDetail as $key => $detail){
	             $uuid = $this->get_uuid();
		     $orderDetail =  array(
				"id" =>$uuid,
				"order_id" =>$orderId,
				"product_id" =>$detail->product_id,
				"variant_id" =>$detail->variant_id,
				"quantity" =>$detail->quantity,
				"price" =>$detail->price,
				"amount" =>$detail->amount,
				"sort_order" => ($key+1)
			);
	         OrderDetail::create($orderDetail);
		 
		 	 $product = Product::Join('product_variants as pv','pv.product_id','=','products.id')->where('pv.id',$detail->variant_id)->first();
			 $orderDetail['product_name'] =  $product->name;
			 $orderDetail['part_number'] =  $product->part_number;
			 $detailList[] = $orderDetail; 
		
		 }
		 Cart::Where('created_by',$userId)->delete();
		 
		 // Partner Info
		 $partner = User::where('id',$userId)->first();
		 
	
		
		 
		  $orderDetail = [
		    'order' => $orderData,
		    'items' =>  $detailList, // Assuming 'items' is an array of items in the order
		];
		 $order_template = view('emails.order-email', compact('orderDetail'))->render();
		 

		  
		// Email Generate update Settings
		 $config = $this->SystemConfig("Order Creation");
		 if(!empty($config)){
			 $message = $config['description'] ?? "";
			 $subject = html_entity_decode($config['subject'] ?? "", ENT_QUOTES | ENT_HTML5);
			 $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);		 
					 
			 $subject = (str_replace('<Order ID>' , $orderData['order_no'] , $subject));
			 $message = (str_replace('<Table Order>' ,$order_template , $message));
		 
			 //Email for Order
			 $mailData = [];
			 $mailData['name'] = 'Dear '.$partner->name;			   
			 $mailData['email'] = $partner->email;
			 $mailData['subject'] = $subject;
			 $mailData['message'] = $message;
			 $this->sentMail($mailData);
		 }
		 
		 
	        // Commit the transaction
		DB::commit();
	    } catch (\Exception $e) {
		    // Roll back the transaction if anything failed
		    DB::rollBack();
		    return $this->jsonResponse('Failed to create order: ' . $e->getMessage(),400,"Invalid Order");
	    }
	
	   return $this->jsonResponse(['order_id'=>$orderId],200,"Order created Successfully!");
    }
    
    
    
    public function updateStatus(Request $request)
    { 
    
      //  if (!isPermission('edit', 'order', $request->permission_list))
		//	return $this->jsonResponse('Permission Denied!', 403, "No Permission");
			
    	$userId = $request->input('user_id','');
    	$orderId = $request->input('order_id','');
	$status = $request->input('status','');
	$cancel_reason = $request->input('cancel_reason','');

	
	$order = Order::where('id',$orderId)->first();
    	$order->status = $status;
	$order->updated_by = $userId;
	
	if(!empty($cancel_reason)){
		$order->cancelled_by =   $userId;
		$order->cancel_reason = $cancel_reason;
		
		// Partner Info
		 $partner = User::where('id',$order->created_by)->first();
		
		 $config = $this->SystemConfig("Order Cancellations");
		 if(!empty($config)){
			 $message = $config['description'] ?? "";
			 $subject = html_entity_decode($config['subject'] ?? "", ENT_QUOTES | ENT_HTML5);
			 $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);
		 
			 $message = (str_replace('<Order ID>' ,"<a href='".env("SITE_URL").'/order/'.$order->id."'>".$order->order_no."</a>" , $message));
			 $message = (str_replace('<Link>' ,env("SITE_URL").'/order/'.$order->id, $message));
		 
			//Email for Order
			 $mailData = [];
			 $mailData['name'] = 'Dear '.$partner->name;			   
			 $mailData['email'] = $partner->email;			  		
			 $mailData['subject'] = $subject;
			 $mailData['message'] = $message;
			 $this->sentMail($mailData);
		 }
	
	}
	
	
	   if($status=="Shipped"){
	
		// Partner Info
		 $partner = User::where('id',$order->created_by)->first();
		
		 $config = $this->SystemConfig("Order Shipped");
		 if(!empty($config)){
			 $message = $config['description'] ?? "";
			 $subject = html_entity_decode($config['subject'] ?? "", ENT_QUOTES | ENT_HTML5);
			 $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);
		 
			 $message = (str_replace('<Remarks>' ,$order->remarks, $message));
			 $message = (str_replace('<Order Date>' ,$order->delivery_date, $message));
		 
			//Email for Order
			 $mailData = [];
			 $mailData['name'] = 'Dear '.$partner->name;			   
			 $mailData['email'] = $partner->email;			  		
			 $mailData['subject'] = $subject;
			 $mailData['message'] = $message;
			 $this->sentMail($mailData);
		 }
	
	}
	
	$order->update();
	
	return $this->jsonResponse(['order_id'=>$orderId],200,"Order Status Update Successfully!");
    }
    
    public function generatePdf($id){

        
	$order = Order::with('order_detail','order_detail.product','order_detail.variant')->where('id',$id)->first();

	    $pdf = new TCPDF();
	     $pdf->SetCreator(PDF_CREATOR);
	     $pdf->SetAuthor('Your Company Name');
	     $pdf->SetTitle('Order Details #'.$order->order_no);
	     $pdf->SetSubject('Order Details PDF');
	     $pdf->SetKeywords('TCPDF, PDF, order, details');

	// Add a page
	$pdf->AddPage();

	// Set font
	$pdf->SetFont('helvetica', '', 12);

	// Add logo
	$logoPath = url('public/logo.png'); // Update with the path to your logo
	$pdf->Image($logoPath, 10, 10, 40, '', '', '', '', '', false, 300, '', false, false, 0, false, false, false);
	
	

	// Title
	$pdf->Cell(0, 15, 'Order Details', 0, 1, 'C');

	// Order information
	$pdf->Ln(10);
	$pdf->SetFont('helvetica', 'B', 10);
	$pdf->Cell(0, 10, 'Order #'.$order->order_no, 0, 1, 'L');
	$pdf->Cell(0, 5, 'Date: ' .date('d-m-Y',strtotime($order->order_date)), 0, 1, 'L');

	// Table header
	$pdf->Ln(10);
	$pdf->SetFont('helvetica', 'B', 12);
	$pdf->Cell(60, 10, 'Product', 1, 0, 'C');
	$pdf->Cell(30, 10, 'Variant', 1, 0, 'C');
	$pdf->Cell(20, 10, 'Quantity', 1, 0, 'C');
	$pdf->Cell(40, 10, 'Price', 1, 0, 'C');
	$pdf->Cell(40, 10, 'Total', 1, 0, 'C');
	$pdf->Ln();

	// Sample order details
	$pdf->SetFont('helvetica', '', 11);
	

	
	$orderItems = $order->order_detail;
	 $total_amount = 0;
	foreach ($orderItems as $item => $value) {
	
	     $arrProduct = splitString(@$value->product->name, 30);
	     
	     if(count($arrProduct)==1){
	     
	                $pdf->Cell(60, 6, $value->product->name, 1);
	    		$pdf->Cell(30, 6, @$value->variant->part_number,1, 0, 'C');
	    		$pdf->Cell(20, 6, $value->quantity, 1, 0, 'C');
	    		$pdf->Cell(40, 6, "$".$value->price, 1, 0, 'R');
	    		$pdf->Cell(40, 6, "$".$value->amount, 1,0, 'R'); 
			 $pdf->Ln(6);
	     }else{
             foreach( $arrProduct as $index => $product) {

                 if($index==0) {
                        $pdf->Cell(60, 6, $product, 'TLR');
	    		$pdf->Cell(30, 6, @$value->variant->part_number,'TLR', 0, 'C');
	    		$pdf->Cell(20, 6, $value->quantity, 'TLR', 0, 'C');
	    		$pdf->Cell(40, 6, "$".$value->price, 'TLR', 0, 'R');
	    		$pdf->Cell(40, 6, "$".$value->amount, 'TLR',0, 'R'); 
                      }elseif($index==count($arrProduct)-1) {
                       $pdf->Cell(60, 6,$product, 'BLR');
	    		$pdf->Cell(30, 6, '', 'BLR');
	    		$pdf->Cell(20, 6, '', 'BLR');
	    		$pdf->Cell(40, 6, '', 'BLR', 0, 'R');
	    		$pdf->Cell(40, 6, '', 'BLR',0, 'R'); 
                      }else{
                       $pdf->Cell(60, 6,$product, 'LR');
	    		$pdf->Cell(30, 6, '', 'LR');
	    		$pdf->Cell(20, 6, '', 'LR');
	    		$pdf->Cell(40, 6, '', 'LR', 0, 'R');
	    		$pdf->Cell(40, 6, '', 'LR',0, 'R'); 
                      }
		        $pdf->Ln(6);
		}
		
             }
	    
	    
	    
	   
	    $total_amount += $value->amount;
	}

	// Total amount
	$pdf->Ln(10);
	$pdf->SetFont('helvetica', 'B', 12);
	$pdf->Cell(150, 10, 'Total Amount : ',1, 0, 'R');
	$pdf->Cell(40, 10, '$'.$total_amount, 1, 0, 'R');

	    
	    // Set headers to force download or display inline
	    header('Content-Type: application/pdf');
	    header('Content-Disposition: inline; filename="document.pdf"');
	    header('Cache-Control: private, max-age=0, must-revalidate');
	    header('Expires: 0');
	    header('Pragma: public');
	    
	      // Output PDF as a string
	    $pdfContent = $pdf->Output('', 'S');

	    // Encode the PDF content to base64
	    $base64Pdf = base64_encode($pdfContent);

	    // Return as JSON response
	    return json_encode([
	        'pdf' => $base64Pdf,
	        'filename' => 'document.pdf',
	    ]);
	     
 
    }

}