<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\QuoteRequest;
use App\Models\ParlourMaster;
use App\Models\ParlourModule;
use App\Models\BurnFeedSystem;
use App\Models\UploadedFiles;
use App\Models\Country;
use App\Models\LogHistory;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Messages;
use App\Models\Notification;
use App\Mail\GenerateMail;

use DB;

class QuoteRequestController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
		$user_id = $request->input('user_id', '');
		$assignee = $request->input('assignee', '');
		$user_type = $request->input('user_type', '');
		$name = $request->input('submitted_by', '');
		$from_date = $request->input('submitted_date1', '');
		$to_date = $request->input('submitted_date2', '');
		$country_id = $request->input('country_id', '');
		$customer_name = $request->input('customer_name', '');
		$submitted_by = $request->input('submitted_by', '');
		$document_no = $request->input('document_no', '');
		$request_type = $request->input('request_type', '');
		$status = $request->input('status', '');
		

		$search = $request->input('search', '');
		$page = $request->input('page', 1); // Default to page 2 if not specified
		$perPage = $request->input('limit', 10); // Default to 10 if not specified
		$sort_column = $request->input('sort_column', 'quote_request.updated_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$quoteRequest = QuoteRequest::leftJoin('countries', 'quote_request.country_id', '=', 'countries.id');
		$quoteRequest = $quoteRequest->leftJoin('user', 'user.id', '=', 'quote_request.submitted_by');
		$quoteRequest = $quoteRequest->leftJoin('user as u', 'u.id', '=', 'quote_request.assignee');
		$quoteRequest = $quoteRequest->where('quote_request.is_deleted', 0);

		if ($user_type == 'Internal') {
			$quoteRequest = $quoteRequest->where('quote_request.status', '!=', 'Draft');
		} else {
			$quoteRequest = $quoteRequest->where('quote_request.created_by', '=', $user_id);
		}

		// Listview Filters 
		if (!empty($customer_name))
			$quoteRequest = $quoteRequest->where('quote_request.name', 'like', '%'.$customer_name. '%');
		if (!empty($country_id))
			$quoteRequest = $quoteRequest->where('quote_request.country_id', '=', $country_id);
		if (!empty($document_no))
			$quoteRequest = $quoteRequest->where('document_no', 'like', '%' . $document_no . '%');
		if (!empty($request_type))
			$quoteRequest = $quoteRequest->where('request_type', '=', $request_type);
			
		if (!empty($assignee)){
			$lower_assignee  = strToLower($assignee);
			if (substr_count('unassigned',$lower_assignee)) 
			   $quoteRequest = $quoteRequest->whereNull('u.name');
			   else
			 $quoteRequest = $quoteRequest->where('u.name', 'like', '%' . $assignee . '%');
		}
		if (!empty($submitted_by))
			$quoteRequest = $quoteRequest->where('user.name', 'like', '%' . $submitted_by . '%');
		if (!empty($status))
			$quoteRequest = $quoteRequest->where('quote_request.status', 'like', '%' . $status . '%');

		if (!empty($from_date) && empty($to_date))
			$quoteRequest = $quoteRequest->where('submitted_date', '>=', $from_date);

		if (empty($from_date) && !empty($to_date))
			$quoteRequest = $quoteRequest->where('submitted_date', '<=', $to_date);

		if (!empty($from_date) && !empty($to_date)){
			$quoteRequest = $quoteRequest->where('submitted_date', '>=',$from_date);
			$quoteRequest = $quoteRequest->where('submitted_date', '<=', $to_date);
		 }

		// Search Box
		if (!empty($search)) {
			$search = strtolower($search);
			$quoteRequest = $quoteRequest->where(function ($query) use ($search){		       
						       
					$query->where('countries.name', 'like', '%' . $search . '%')
					->orWhere('document_no', 'like', '%' . $search . '%')
					->orWhere('u.name', 'like', '%' . $search . '%')
					->orWhere('user.name', 'like', '%' . $search . '%')
					->orWhere('quote_request.name', 'like', '%' . $search . '%')
					->orWhere('submitted_date', 'like', '%' . $search . '%')
					->orWhere('quote_request.status', 'like', '%' . $search . '%');
				
				      });
			
		}

		$quoteRequest = $quoteRequest->select(
			'quote_request.*',
			'user.name as submitted_name',
			'u.name as assignee_name',
			'assignee as assignee_id',
			'countries.name as country_name'
		);
		$quoteRequest = $quoteRequest->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($quoteRequest);
	}

	public function show($id, Request $request)
	{
		if (!isPermission('edit', 'parlour-request', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
			
	      

		$modules = ParlourModule::get();
		$quoteRequest = new QuoteRequest;
		$column = $quoteRequest->getColumn($modules);
		$quoteRequest = DB::select("SELECT quote_request.*" . $column . " FROM quote_request 
    								WHERE quote_request.id = :id", ['id' => $id]);
		
		if(empty($quoteRequest)) 
		    	return $this->jsonResponse("Record Not Found!", 400, "Request Failed!");

		$quoteRequest = !empty($quoteRequest) ? $quoteRequest[0] : [];
		$quoteRequest->burn_feed_system = BurnFeedSystem::where('request_id', $id)->orderBy('sort_order')->get() ;
		$quoteRequest->attachments = UploadedFiles::where('request_id', $id)->get();

		return $this->jsonResponse($quoteRequest, 200, "Quote Request Data");
	}

	public function validateRequest($request, $id = null)
	{
		$model = new QuoteRequest();
		$rules = $model->tabWiseRules($request, 1);
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
		$maxCode = QuoteRequest::max('document_no');

		$insertArr = [
			'id' => $uuid,
			'document_no' => str_pad($maxCode + 1, 4, '0', STR_PAD_LEFT),
			'document_date' => @$request->document_date,
			'request_type' =>  @$request->request_type,
			'name' => @$request->name,
			'email' => @$request->email,
			'house' => @$request->house,
			'road' => @$request->road,
			'town' => @$request->town,
			'county_id' => @$request->county_id,
			'country_id' => @$request->country_id,
			'postcode' => @$request->postcode,
			'phone_no' => @$request->phone_no,
			'parlour_style_id' => @$request->parlour_style_id,
			'rotary_style_id' => @$request->rotary_style_id,
			'no_of_milking_units' => @$request->no_of_milking_units,
			'no_of_cow_stalls' => @$request->no_of_cow_stalls,
			'cow_standing_id' => @$request->cow_standing_id,
			'type_of_cow_id' => @$request->type_of_cow_id,
			'no_of_cows' => @$request->no_of_cows,
			'electricity_id' => @$request->electricity_id,
			'express_fit' => @$request->express_fit,
			'installation_id' => @$request->installation_id,
			'delivery_id' => @$request->delivery_id,
			'est_delivery_date' => @$request->est_delivery_date,
			'created_by' => @$request->user_id,
			'updated_at' => date('Y-m-d H:i:s'),
			'status' => 'Draft',
		];
		
		if(@$request->request_type == 2)
		   $insertArr['rotary_style_id'] = @$request->rotary_style_id;
		else{
		   $insertArr['parlour_style_id'] = @$request->parlour_style_id;
		   $insertArr['cow_standing_id'] = @$request->cow_standing_id;
		}

		QuoteRequest::create($insertArr);
		return $this->jsonResponse(['request_id' => $uuid], 200, "Add Quote Request Successfully!");
	}

	public function createLogs($old_array, $current_array)
	{
		$master = ParlourMaster::pluck('name', 'id');
		$arr = [];
		$i = 1;
		
		if(isset($old_array['country_id']) || isset($current_array['country_id'])){
		  $country = Country::pluck('name','id');
		  $old_array['country_id'] = $country[$old_array['country_id']] ?? "";
		  $current_array['country_id'] = $country[$current_array['country_id']] ?? "";
		}
		foreach ($old_array as $key => $old) {
			$value1 = is_null($old) ? '' : $old;
			$value2 = (!isset($current_array[$key]) || is_null($current_array[$key])) ? '' : $current_array[$key];


			$activeList = [0 => 'No', 1 => 'Yes'];
			if ($value1 != $value2) {
				$title = str_replace("_", " ", $key);
				$title = ucwords(str_replace(" id", "", $title));

				$oldFirst = (!empty($value1) || $value1 == 0) ? (isset($master[$value1]) ? $master[$value1] : $value1) : 'empty';
				$newFirst = (!empty($value2) || $value2 == 0) ? (isset($master[$value2]) ? $master[$value2] : $value2) : 'empty';

				$oldFirst = $activeList[$oldFirst] ?? $oldFirst;
				$newFirst = $activeList[$newFirst] ?? $newFirst;


				if ($key == 'vision_herd_management_extras' || $key == 'parlour_stall_extras') {
					if ($oldFirst != 'v') {
						$oldFirst = json_decode($oldFirst, true);
						if (!is_array($oldFirst))
							$oldFirst = json_decode($oldFirst, true) ?? 'empty';

					}

					if ($newFirst != 'empty')
						$newFirst = json_decode($newFirst, true);
				}

				if ($oldFirst != $newFirst) {

					// $oldFirst = (is_array($oldFirst) ? ($oldFirst) : $oldFirst  );
					// $newFirst = (is_array($newFirst) ? ($newFirst) : $newFirst  );

					$arr[] = ['title' => $title, 'old_data' => $oldFirst, 'new_data' => $newFirst];
					// $arr[] =  ($i).'- '.$title.' Replace <b>'.$oldFirst.'</b> By <b>'.$newFirst.'</b>';
					$i++;
				}

			}
		}


		return $arr;
		// return implode(' <br> ',$arr);
	}
	public function update(Request $request, $id)
	{
		// Validation Rules
		//  $isError = $this->validateRequest($request->all(),$id);
		//  if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
		
		$model = new QuoteRequest();
		$tabName = $model->getTabNames();
		
		$quoteRequest = QuoteRequest::where('id', $id)->first();
		if (empty($quoteRequest))
			return $this->jsonResponse('Data Not Found!', 400, "Request Failed!");

		
		//Old Data
		$quoteRequestData = $quoteRequest;
		$quoteRequestData->tab_no = $request->tab_no;
		$oldData = $model->tabWiseFilter($quoteRequestData);



		// New Data
		$updateData = $model->tabWiseFilter($request);

		if (empty($updateData) && $request->tab_no != 9)
			return $this->jsonResponse('Data Not Found!', 400, "Request Failed!");
		$burnLog = [];
		if ($request->tab_no == 8) {
			$burnFeed = BurnFeedSystem::where('request_id', $id);
			$feeId =	$burnFeed->pluck('id');
			$groupDetailId =	$burnFeed->get()->groupBy('id');
			if (isset($request->feed_stations)) {
				$detailArr = $detail = [];
				$burnList = ['Single', 'Double', 'Quad'];
				foreach (@$request->feed_stations as $key => $value) {


					if (@$feeId[$key]) {
						$detail = $groupDetailId[$feeId[$key]];
						$burnFeedRow = BurnFeedSystem::where('id',$feeId[$key])->first();
						$detailArr = [
							'feed_stations' => @$value,
							'feed_type' => @$request->feed_type[$key] ?? '',
							'anti_bully_bars' => @$request->anti_bully_bars[$key] ?? 0,
							'sort_order' => $key
						];

						$detail = [
							'feed_stations' => $burnFeedRow['feed_stations'],
							'feed_type' => $burnFeedRow['feed_type'],
							'anti_bully_bars' => $burnFeedRow['anti_bully_bars']
						];


						$burnFeedRow->update($detailArr);

						$burnLogRow = $this->createLogs($detail, $detailArr);


						foreach ($burnLogRow as &$row) {
							$row['title'] = $row['title'] . ' (' . $burnList[$key] . ')';
							$burnLog[] = $row;
						}

					} else {

						
						$detail = [
							'feed_stations' => '',
							'feed_type' => '',
							'anti_bully_bars' => ''
						];
						$uuid = $this->get_uuid();
						$detailArr = [
							'id' => $uuid,
							'request_id' => $id,
							'feed_stations' => @$value,
							'feed_type' => @$request->feed_type[$key] ?? '',
							'anti_bully_bars' => @$request->anti_bully_bars[$key] ?? 0,
							'sort_order' => $key
						];

						BurnFeedSystem::create($detailArr);
						
						
						unset($detailArr['id']);
						unset($detailArr['request_id']);
						unset($detailArr['sort_order']);
						$burnLogRow = $this->createLogs($detail, $detailArr);
					

						foreach ($burnLogRow as &$row) {
							$row['title'] = $row['title'] . ' (' . $burnList[$key] . ')';
							$burnLog[] = $row;
						}
					}


				}
			}
		}


		if ($request->tab_no == 9) {
			$data = $request->all();
			$logs = [];
			if (isset($data['attachments'])) {
			        
				UploadedFiles::where('request_id', $id)->delete();
				
				foreach ($data['attachments'] as $key => $value) {
					$file = '';
					if (!empty($value) && !file_exists('public/attachments/'.$value))
						$file = $this->base64ToImage($value, 'public/attachments/', 'A' . ($key + 1));

					$old_attachment = $data['old_files'][$key] ?? "";
					
					
  					// Attachments Log Creation
					if(!empty($file)){
			                $logs = $this->createLogs(['Attachment '.($key+1)=>""],['Attachment '.($key+1)=>$file]);
			                  $this->logRecord($id,$request->user_id,'Quote Request Form',$tabName[$request->tab_no],$logs);
					}
					$file = (!empty($file) ? $file : $value);
					  
					  
					// $file = (!empty($file) ? $file : $data['old_files'][$key]);
					$uuid = $this->get_uuid();
					$detailArr = [
						'id' => $uuid,
						'request_id' => $id,
						'file_name' => $file,
						'file_path' => 'attachments/',
					];


					UploadedFiles::create($detailArr);
					 
				}
				
				foreach ($data['old_files'] as $val) {
				  if(file_exists('public/attachments/'.$val)){
				       unlink('public/attachments/'.$val);
				       // Attachments Log Creation
			
			                $logs = [["title"=>"Attachment ","old_data"=>$value,"new_data"=>$value.' has been Deleted!']];
			                $this->logRecord($id,$request->user_id,'Quote Request Form',$tabName[$request->tab_no],$logs);
					
				  }
				}
				
			}

			$updateData  = $logs =  [];
			$qoute = QuoteRequest::where('id', $id)->first();
			if (isset($data['final_quote']) && !empty($data['final_quote'])) {
			        $old_final_quote = $qoute->final_quote;
				$file = $this->base64ToImage($data['final_quote'], 'public/attachments/', 'A1');
				$qoute->final_quote = (!empty($file) ? $file : '');
				$qoute->final_quote_path = 'attachments/';
				$qoute->comments = $data['comments'];
				
			     // Create Logs
			     $logs = $this->createLogs(['Final Quote'=>$old_final_quote,'Comments'=>$data['comments']],
			     				['Final Quote'=>$qoute->final_quote,'Comments'=>$qoute->comments]);

			} else {
			        $old_final_quote = $qoute->final_quote;
				$qoute->final_quote = $data['old_final_quote'] ?? "";
				$qoute->final_quote_path = 'attachments/';
				$qoute->comments = $data['comments'];
				$logs = $this->createLogs(
				['Final Quote'=>$old_final_quote,'Comments'=>$data['comments']],
					['Final Quote'=>$qoute->final_quote,'Comments'=>$qoute->comments]);
			}
			if(!empty($logs) && $request->user_type == 'Internal')
			$this->logRecord($id,$request->user_id,'Quote Request Form',$tabName[$request->tab_no],$logs);

			if (isset($request->submitted_by) ) {
			       $partner = User::where('id', $quoteRequest->created_by)->first();
			       
				$mailData = [
					   'name'=>'Hi '.$partner->name,
					   'email'=>$partner->email
					   ];
				if($request->user_type == 'Internal'){
				
				  	 $config = $this->SystemConfig("Update Quote Request");
					 $message = $config['description'] ?? "";
					 $subject = html_entity_decode($config['subject'] ?? "", ENT_QUOTES | ENT_HTML5);
					 $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);
					 
					 $subject = (str_replace('<Request ID>' , $quoteRequest->document_no , $subject));
					 $message = (str_replace('<Link>' , env("SITE_URL").'/quote/view/'.$quoteRequest->id.'?tab=10' , $message));
					 
					 
				       	 $mailData['subject'] = $subject;
					 $mailData['message'] = $message;
					 $this->sentMail($mailData);
				       
				}else if(!empty($request->submitted_by) && $request->submitted_by!='Internal'){
				
					$qoute->status = 'Submitted';
				        $qoute->submitted_by = $request->submitted_by;
				        $qoute->submitted_date = date('Y-m-d');
					
					// Email Generate update Settings
					 $config = $this->SystemConfig("Create Quote Request");
					 $message = $config['description'] ?? "";
					 $subject = html_entity_decode($config['subject'] ?? "", ENT_QUOTES | ENT_HTML5);
					 $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);
					 
					 
					 $subject = (str_replace('<Request ID>' , $quoteRequest->document_no , $subject));
					 $message = (str_replace('<Link>' , '<a href="'.env("SITE_URL").'">'.env("SITE_ADDRESS").'</a>' , $message));
			
				         $mailData['subject'] = $subject;
					 $mailData['message'] = $message;
			
					  $this->sentMail($mailData);
				}
				
				
			}

			$qoute->update();

		}

		if ($request->tab_no != 9) {
			unset($quoteRequest->tab_no);
			$quoteRequest->update($updateData);

			$uuid = $this->get_uuid();
			$logs = [];
			if ($request->user_type == 'Internal') {
				$logs = $this->createLogs($oldData, $updateData);
				$logs = array_merge($logs, $burnLog);
			}
			if (!empty($logs)) {
			 // Create Logs
			  $this->logRecord($id,$request->user_id,'Quote Request',$tabName[$request->tab_no],$logs);
			}
		}

		return $this->jsonResponse(['request_id' => $id], 200, "Update  Quote Request Successfully!");
	}
	public function logRecord($id,$user_id,$screen,$tab_no,$logs){
		$uuid = $this->get_uuid();
		$arrLog = [
			'id' => $uuid,
			'request_id' => $id,
			'created_by_id' =>$user_id,
			'tab' => $tab_no,
			'screen' => $screen,
			'json' => json_encode($logs),
		];

		LogHistory::create($arrLog);
	}
	public function messages(Request $request){

           $quoteRequest = QuoteRequest::where('id',$request->request_id)->first();
           $user = User::where('id',$request->user_id)->first();
	   $uId = $quoteRequest->created_by;
	   if(@$user->user_type=='Partner' ) {
	   	$uId =  !empty($quoteRequest->assignee) ? $quoteRequest->assignee : null;
	   }
	  
	   $file = "";
	   if (!empty($request->attachment))
	   	$file = $this->base64ToImage($request->attachment, 'public/attachments/', '',$request->attachment_name);
	    
	    $uuid = $this->get_uuid();		
	    Messages::create([
	       'id' => $uuid,
	        'request_id' => $request->request_id,
	        'message' => $request->message,
	        'file_name' =>(!empty($file) ? $file : ''),
		'file_path' => 'attachments/' ,
		'created_by' =>$request->user_id,
	    ]);
	    
	    Notification::create([
	       'id' => $uuid,
	       'user_id' => $uId,
	       'request_id' => $request->request_id,
	       'heading_text' => $quoteRequest->document_no,
	        'message' => $request->message,
		'created_by' =>$request->user_id,
	    ]);
	    
	    
	    if(@$user->user_type!='Partner' ) {
		// Partner Info
		 $partner = User::where('id',$quoteRequest->created_by)->first();
	   
		// Email Generate update Settings
		 $config = $this->SystemConfig("Chat Message");
		 $message = $config['description'] ?? "";
		 $subject = html_entity_decode($config['subject'] ?? "", ENT_QUOTES | ENT_HTML5);
		 $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);		 
	
		 $message = (str_replace('<Link>' ,env("SITE_URL").'/quote/view/'.$quoteRequest->id.'#chat', $message));
		 
		 //Email for Order
		 $mailData = [];
		 $mailData['name'] = 'Dear '.$partner->name;			   
		 $mailData['email'] = $partner->email;
		 $mailData['subject'] = $subject;
		 $mailData['message'] = $message;	
	         $this->sentMail($mailData);
	    }
	  
	  $quoteRequest->updated_at = date('Y-m-d H:i:s');
	  $quoteRequest->save();


         return $this->jsonResponse(['message_id' =>  $uuid], 200, "Message Sent Successfully!");

	}
	
	public function quoteMailSent($data){
	
	       if(empty($data['name'])) return false;
	        $_return = "";
		// Email Generate update Settings
	        $this->getSettings(true);
		
		try{
		  $insdata = [
		    	'name' => $data['name'],
			'subject' => $data['subject'],
			'message' => $data['message']
			];	
     
     		   Mail::to($data["email"])->send(new GenerateMail($insdata));
		 }catch (\Exception $e) {
	    		Log::error('Email sending failed: ' . $e->getMessage());
		        $_return = " But Email Not Sent.Please Check Your Email or Contact to your Administrator!";
	         }
		 
           return $_return; 
	 
	 }

	public function logList(Request $request)
	{


		$id = $request->input('request_id', '');
		$search = $request->input('search', '');
		$page = $request->input('page', 1); // Default to page 2 if not specified
		$perPage = $request->input('limit', 10); // Default to 10 if not specified
		$sort_column = $request->input('sort_column', 'log_history.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$logHistory = LogHistory::where('request_id', $id);
		$logHistory = $logHistory->leftJoin('user', 'user.id', '=', 'log_history.created_by_id');

		$logHistory = $logHistory->select('log_history.*', 'user.name as perform_by');
		$logHistory = $logHistory->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($logHistory);
	}

	public function addAssignee(Request $request)
	{

		$id = $request->input('request_id', '');
		$user_id = $request->input('assignee', '');
		$quoteRequest = QuoteRequest::where('id', $id)->first();

		if (!$quoteRequest)
			return $this->jsonResponse(['request_id' => $id], 404, "Quote Request Not Found!");
		
		$quoteRequest->assignee = $user_id;
		$quoteRequest->status = 'Under Review';
		$quoteRequest->save();
		return $this->jsonResponse(['request_id' => $id], 200, "Add Assignee Successfully!");
	}
	
	public function changeAssignee(Request $request)
	{

		$id = $request->input('request_id', '');
		$user_id = $request->input('assignee_id', '');
		$users = User::where('status', 1)->where('user_type','Internal')->pluck('name','id');
		$quoteRequest = QuoteRequest::where('id', $id)->first();

		if (!$quoteRequest)
			return $this->jsonResponse(['request_id' => $id], 404, "Quote Request Not Found!");
		
		$logs = $this->createLogs(['Assignee'=>$users[$quoteRequest->assignee]], 
		                          ['Assignee'=>$users[$user_id]]);
			
		$quoteRequest->assignee = $user_id;
		$quoteRequest->save();
		
		// Create Logs
		$this->logRecord($id,$request->user_id,'Quote Request List','List View',$logs);
		return $this->jsonResponse(['request_id' => $id], 200, "Change Assignee Successfully!");
	}



	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'parlour-request', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$quoteRequest = QuoteRequest::where('id', $id)->first();

		if (!$quoteRequest)
			return $this->jsonResponse(['request_id' => $id], 404, "Quote Request Not Found!");

		$quoteRequest->is_deleted = 1;
		$quoteRequest->save();
		return $this->jsonResponse(['request_id' => $id], 200, "Delete Quote Request Successfully!");
	}

	public function bulkDelete(Request $request)
	{

		if (!isPermission('delete', 'parlour-request', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->quote_request_ids) && !empty($request->quote_request_ids) && is_array($request->quote_request_ids)) {
				foreach ($request->quote_request_ids as $quote_request_id) {
					$user = QuoteRequest::where(['id' => $quote_request_id])->first();
					$user->is_deleted = 1;
					$user->update();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Quote Requests successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}







}
