<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use App\Models\Company;
// use App\Models\EmployeeRegistration;
use App\Models\User;
use App\Models\UserToken;
use App\Models\AssignModule;
use App\Models\OtherModel;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use  App\Models\Employee;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\DB;
use App\Mail\GenerateMail;
use App\Models\CompanyBranch;
use App\Models\UserBranchAccess;
use App\Models\UserPermission;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{

    public function __construct(DatabaseManager $db)
    {
        parent::__construct($db);
    }

    public function login(Request $request)
    {

        $this->validate($request, [
            'email' => 'required',
            'password' => 'required',
        ]);

        $credentials = $request->only(['email', 'password']);
        $user = UserToken::login($credentials);
        if (isset($user['timeout'])) {
            return $this->jsonResponse($user['error'] ?? '', 400, 'Login Timeout');
        }
        if (isset($user['user_id'])) {
            $user_data = User::where('user_id', $user['user_id'])->first();
            $user_access = UserBranchAccess::where('user_id', $user['user_id']);
            $company = array_unique($user_access->pluck('company_id')->toArray());
            $branchList = ($user_access->pluck('company_branch_id', 'company_branch_id'));
            $companies = Company::with('branches');
            if ($user_data['super_admin'] != 1)
                $companies = $companies->whereIn('company_id', $company);
            $companies = $companies->get();

            $groupedData = [];

            foreach ($companies as $company) {
                $branches = [];

                foreach ($company->branches as $branch) {

                    if ($user_data['super_admin'] == 1 || isset($branchList[$branch->company_branch_id])) {
                        $branches[] = [
                            'value' => $branch->company_branch_id,
                            'label' => $branch->name,
                        ];
                    }
                }

                $groupedData[] = [
                    'value' => $company->company_id,
                    'label' => $company->name,
                    'branches' => $branches,
                ];
            }

            // $user = UserBranchAccess::find('user_id', $user['user_id'])->first();

            // $data = Company::get();
            // $arrModules = [];
            // foreach($data as $row) {
            //     $branches = CompanyBranch::select("company_branch_id as value","name as label")->where('company_id',$row->company_id)->get();
            //     $arrModules[] = [
            //         'value' => $row->company_id,
            //         'label'=> $row->name,
            //         'branches'=> $branches,
            //     ];
            // }
            // // $aUserGroup = UserPermission::where('user_permission_id', $user['permission_id'])->select('user_permission_id','permission')->first();
            // $user['company_and_branches'] = $arrModules;

            // $user['permission'] = (empty($aUserGroup)) ? null : json_decode($aUserGroup['permission']);



            return $this->jsonResponse($groupedData, 200, 'Login Successfully');
        } else {
            return $this->jsonResponse("Invalid Email or Password!", 400, 'Login Failed');
        }
    }


    public function session(Request $request)
    {
        $this->validate($request, [
            'company_id' => 'required',
            'company_branch_id' => 'required',
            'email' => 'required',
            'password' => 'required',
        ]);

        $userData = UserToken::userPermission($request->all());

        if (empty($userData))
            return $this->jsonResponse("Something went wrong. Contact Administrator", 401, "User do not have Permission: ");

        if ($userData) {
            if (isset($userData['image']))
                $userData['image_url']  = !empty($userData['image']) ?  url('public/uploads/' . $userData['image']) : '';

            return $this->jsonResponse($userData, 200, 'Login Successfully');
        } else {
            return $this->jsonResponse([], 401, 'Unauthorized User');
        }
    }




    public function checkAdmin(Request $request)
    {

        $user = AssignModule::where('user_id', $request->user_id)->first();
        if ($user) {
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
        $this->validate($request, ['user_id' => 'required|string']);
        $access_token = $request->header('Authorization');
        // remove key from access token
        $access_token = str_replace('api_token ', '', $access_token);
        $user = UserToken::where('api_token', $access_token)->where('user_id', $request->user_id);

        if ($user) {
            $user->update(['api_token' => null]);
            return $this->jsonResponse([], 200, "Logout Successfully");
        } else {
            return $this->jsonResponse([], 401, "Logout Failed");
        }
    }

    public function refresh(Request $request)
    {

        $this->validate($request, ['login_id' => 'required|string']);

        $user = UserToken::refreshToken($request->login_id);
        return $this->jsonResponse($user, 200, "Logout Successfully");
    }


    public function forgotPassword(Request $request)
    {


        $rules = [

            'old_password' => 'required',
            'new_password' => 'required|string|min:8',
            'confirm_password' => 'required|string|same:new_password'
        ];
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            $response =  $errors = $validator->errors()->all();
            $firstError = $validator->errors()->first();
            return $this->jsonResponse($firstError, 400, "Request Failed!");
        }


        // Get User Detail
        $user = User::where('user_id', $request->login_user_id)->first();
        if (empty($user)) return $this->jsonResponse("Invalid Request!", 400, "Invalid Request!");
        if (md5($request->old_password) != $user['password']) return $this->jsonResponse("Old Password is Incorrect!", 400, "Invalid Password!");
       
        $user->password = md5($request->new_password);
        $user->update();



        // Sent EMail     
        // $config = $this->SystemConfig("Forgot Password");
        // $message = $config['description'] ?? "";
        // $subject = html_entity_decode($config['subject'] ?? "", ENT_QUOTES | ENT_HTML5);
        // $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);
        // $message = (str_replace('<Link>', '<a href="' . env("SITE_URL") . '">' . env("SITE_ADDRESS") . '</a>', $message));

        // $mailData = [
        //     'email' => $user['email'],
        //     'name' => 'Dear ' . $user['name'],
        //     'subject' => $subject,
        //     'message' => $message
        // ];

        // $this->sentMail($mailData);

        return $this->jsonResponse(['user_id' => $user['id']], 200, "Password Reset!");
    }
    public function verifyEmail(Request $request)
    {

        $rules = ['email' => 'required|string'];
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            $response =  $errors = $validator->errors()->all();
            $firstError = $validator->errors()->first();
            return $this->jsonResponse($firstError, 400, "Request Failed!");
        }

        $user = User::where('email', $request->email)->where('status', 1)->where('is_deleted', 0)->first();
        if (empty($user)) {
            return $this->jsonResponse("Invalid Email", 401, "Invalid Email!");
            exit;
        }

        $user->is_change_password = 0;
        $user->update();



        $actionUrl = str_replace('api', '', url('/') . 'reset-password?id=' . $user['id']);


        $config = $this->SystemConfig("Forgot Password");
        $message = $config['description'] ?? "";
        $subject = html_entity_decode($config['subject'] ?? "", ENT_QUOTES | ENT_HTML5);
        $message = html_entity_decode($message, ENT_QUOTES | ENT_HTML5);

        $message = (str_replace('<Reset Password>', '<a href="' . $actionUrl . '" style="display: inline-block; padding: 0px 5px; font-size: 14px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 4px;">Reset Password</a>', $subject));
        $message = (str_replace('<Link>', '<a href="' . env("SITE_URL") . '">' . env("SITE_ADDRESS") . '</a>', $message));

        $mailData = [
            'email' => $user['email'],
            'name' => 'Dear ' . $user['name'],
            'subject' => $subject,
            'message' => $message
        ];

        $this->sentMail($mailData);



        $this->sentMail($data);
        return $this->jsonResponse(['user_id' => $user['id']], 200, "Email has been sent!");
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
