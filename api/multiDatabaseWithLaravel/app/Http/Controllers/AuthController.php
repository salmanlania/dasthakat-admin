<?php

namespace App\Http\Controllers;

use App\Models\Company;
// use App\Models\EmployeeRegistration;
use App\Models\UserToken;
use App\Models\AssignModule;
use App\Models\OtherModel;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use  App\Models\Employee;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\DB;
class AuthController extends Controller
{

    public function __construct(DatabaseManager $db)
    {
        parent::__construct($db);
    }

    public function login(Request $request)
    {
        $this->validate($request, [
            'login_name' => 'required',
            'login_password' => 'required',
        ]);

        $credentials = $request->only(['login_name', 'login_password']);
        $user = UserToken::login($credentials);
        if($user) {
            return $this->jsonResponse($user, 200, 'Login Successfully');
        } else {
            return $this->jsonResponse([], 401, 'Unauthorized User');
        }
    }
    
    
    public function session(Request $request) {
          $this->validate($request, [
                'user_id' => 'required',
                'company_id' => 'required',
	        'company_branch_id' => 'required',
	        'fiscal_year_id' => 'required',
          ]);

        $userData = UserToken::userPermission($request->all());
	if(empty($userData))
	return $this->jsonResponse("Something went wrong. Contact Administrator", 401, "User do not have Permission: ");

         if($userData) {
            return $this->jsonResponse(	$userData, 200, 'Login Successfully');
        	} else {
            return $this->jsonResponse([], 401, 'Unauthorized User');
         }
    }
    
    
    
    
    public function checkAdmin(Request $request)
    {
      
        $user = AssignModule::where('user_id',$request->user_id)->first();
        if($user) {
            return $this->jsonResponse($user, 200, 'Login Successfully');
        } else {
            return $this->jsonResponse([], 401, 'user not found');
        }
    }


    

    // public function getToken(Request $request)
    // {
    //    $user = UserToken::where('access_token',$request->access_token)->where('login_id',$request->login_id);
    //    if($user)
    //      jsonResponse($user,'200');
    //    else
    //      jsonResponse('Token Expired','403'); 
    // }

//    public function me(Request $request)
//    {
//        $this->validate($request, ['employee_id' => 'required|string']);
//
//        $employee_id = $request->employee_id;
//        //$employee = Employee::where('employee_id', $employee_id)->first();
//        $employee = Employee::find($employee_id);
//        $registrations = EmployeeRegistration::where('employee_id','=',$employee_id)->where('status','=','Active')->get();
//        $company = [];
//        foreach($registrations as $reg) {
//            $objCompany = Company::find($reg->company_id);
//            $company[] = [
//                'employee_registration_id' => $reg->employee_registration_id,
//                'company_id' => $objCompany->company_id,
//                'company_name' => $objCompany->company_name
//            ];
//        }
//
//        $data = [
//            'employee_id' => $employee->employee_id,
//            'login_id' => $employee->login_id,
//            'full_name' => $employee->full_name,
//            'employee_image' => $employee->employee_image,
//            'joining_date' => $employee->joining_date,
//            'email' => $employee->email,
//            'mobile_no' => $employee->mobile_no,
//            'gender' => $employee->gender,
//            'cnic_no' => $employee->cnic_no,
//            'company' => $company
//        ];
//
//        //$data = $employee->employee_id;
//        return $this->jsonResponse($data, 200, 'Information fetch successfully!');
//    }

    public function logout(Request $request)
    {
        $this->validate($request, ['login_id' => 'required|string']);
        $access_token = $request->header('Authorization');
        // remove key from access token
        $access_token = str_replace('access_token ', '', $access_token);
        $user = UserToken::where('access_token',$access_token)->where('login_id',$request->login_id);

        if($user){
            $user->update(['access_token' => null]);
            return $this->jsonResponse([],200,"Logout Successfully");
        } else {
            return $this->jsonResponse([],401,"Logout Failed");
        }
    }

    public function refresh(Request $request)
    {

        $this->validate($request, ['login_id' => 'required|string']);

        $user = UserToken::refreshToken($request->login_id);
        return $this->jsonResponse($user,200,"Logout Successfully");
    }

    public function changePassword(Request $request)
    {
//        $this->validate($request, [
//            'login_id' => 'required|string',
//            'old_password' => 'required|string',
//            'new_password' => 'required|string',
//        ]);
//
//        try{
//
//            $employee_id = $request->employee_id;
//            $old_password = MD5($request->old_password);
//            $new_password = MD5($request->new_password);
//
//            $employee = Employee::where('employee_id', $employee_id)
//            ->where('login_password', $old_password)->first();
//
//            if($employee){
//                $employee->login_password = $new_password;
//                $employee->save();
//                return response()->json([
//                    'message' => 'Password Changed Successfully!',
//                    'status' => 'success',
//                    'status_code' => 200,
//                ]);
//            }
//            else
//            {
//                return response()->json([
//                    'message' => 'Invalid Old Password!',
//                    'status' => 'failed',
//                    'status_code' => 401
//                ], 401);
//            }
//
//        }
//        catch(\Exception $e){
//            return response()->json([
//                'message' => 'Password Changed Faild!',
//                'status' => 'failed',
//                'status_code' => 401,
//                // 'error' => $e->getMessage(),
//                // 'e' => $e
//            ], 401);
//        }

    }

}
