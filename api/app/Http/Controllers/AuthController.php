<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use App\Models\Company;
use App\Models\User;
use App\Models\UserToken;
use Illuminate\Http\Request;
use Illuminate\Database\DatabaseManager;
use App\Models\UserBranchAccess;
use Carbon\Carbon;

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

        $user = UserToken::userPermission($request->all());
        $company = Company::where('company_id', $request->company_id)->first();
        if (isset($user->user_id)) {

            if ($user->is_exempted == 1 || $company->is_exempted == 1) {
                if (isset($user['image']))
                    $user['image_url']  = !empty($user['image']) ?  url('public/uploads/' . $user['image']) : '';

                return $this->jsonResponse($user, 200, 'Login Successfully');
            }
            $otp = mt_rand(100000, 999999);
            $updateUser = User::where('user_id', $user->user_id)->first();
            $updateUser->update([
                'otp' => $otp,
                'otp_created_at' => Carbon::now(), // store current timestamp
            ]);
            $data = [
                'data' => ['otp' => $otp],
                'email' => $updateUser->email,
                'name' => $updateUser->user_name,
                'subject' => 'OTP Verification',
                'message' => 'Your OTP is ' . $otp,
            ];

            $this->sentMail($data);
            if (isset($user['image']))
                $user['image_url']  = !empty($user['image']) ?  url('public/uploads/' . $user['image']) : '';

            return $this->jsonResponse($user, 200, 'Login Successfully');
        } else {
            return $this->jsonResponse($user, 400, 'Session Failed');
        }
    }
    public function verify(Request $request)
    {

        $this->validate($request, [
            'company_id' => 'required',
            'company_branch_id' => 'required',
            'email' => 'required',
            'password' => 'required',
            'code' => 'required',
        ]);

        $user = UserToken::userPermission($request->all());
        $company = Company::where('company_id', $request->company_id)->first();
        if (isset($user->user_id)) {

            if ($user->opt == $request->otp) {
                if (isset($user['image']))
                    $user['image_url']  = !empty($user['image']) ?  url('public/uploads/' . $user['image']) : '';


                if ($user->otp_created_at && Carbon::now()->diffInMinutes($user->otp_created_at) > 5) {
                    return $this->jsonResponse("The OTP you entered is no longer valid. Please request a new code.", 400, 'OTP has expired');
                }

                User::where('user_id', $user->user_id)->update(['otp' => null, 'otp_created_at' => null]);

                return $this->jsonResponse($user, 200, 'Login Successfully');
            } else {
                return $this->jsonResponse("Oops! That OTP doesn't match. Double-check and try again.", 400, 'Session Failed');
            }
        } else {
            return $this->jsonResponse($user, 400, 'Session Failed');
        }
    }

    public function logout(Request $request)
    {
        $this->validate($request, ['user_id' => 'required|string']);
        $access_token = $request->header('Authorization');
        // remove key from access token
        $access_token = str_replace('api_token ', '', $access_token);
        $user = User::where('api_token', $access_token)->where('user_id', $request->user_id);

        if ($user) {
            $user->update(['api_token' => null]);
            return $this->jsonResponse([], 200, "Logout Successfully");
        } else {
            return $this->jsonResponse([], 401, "Logout Failed");
        }
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

        return $this->jsonResponse(['user_id' => $user['id']], 200, "Password Reset!");
    }
}
