<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class UserToken extends Model
{

    public static $secret = 'Burhani';
    protected $table = 'user';
    protected $primaryKey = 'user_id';
    public $timestamps = false;

    protected $hidden = [];

    public static function login($credentials)
    {
        $email = $credentials['email'];
        $password = md5($credentials['password']);

        $user = User::where('email', $email)
            ->where('password', $password)
            ->where('status', 1)
            ->first();

        if ($user) {
            $currentTime = date("H:i:s");
            $fromTime = $user['from_time'] ?? '00:00:00';
            $toTime = $user['to_time'] ?? '23:59:59';
            if ($currentTime >= $fromTime && $currentTime <= $toTime) {
                return $user;
            } else {
                return [
                    'error' => "Access denied. You can only log in between " . date('h:i A', strtotime($fromTime)) . " and " . date('h:i A', strtotime($toTime)),
                    'status' => 400,
                    'timeout' => true,
                    'success' => true
                ];
            }
        }
        return [];

    }

    public static function userPermission($filter)
    {

        $company_id = $filter['company_id'];
        $company_branch_id = $filter['company_branch_id'];
        $email = $filter['email'];
        $password = md5($filter['password']);

        $user = User::where('email', $email)
            ->where('password', $password)
            ->where('status', 1)
            ->first();
            
            $company = Company::where('company_id',$company_id)->first();
            $company_branch = CompanyBranch::where('company_branch_id',$company_branch_id)->first();
        $userBranch = UserBranchAccess::with('company', 'company_branch')
            ->where('user_id', $user['user_id'])
            ->where('company_id', $company_id)
            ->where('company_branch_id', $company_branch_id)
            ->first();
        if($user['super_admin'] != 1)
        if (empty($userBranch))  return " No Permission! ";

        $aUser = User::where('user_id', $user['user_id'])->where('status', 1)->first();
        if (empty($aUser))  return " Invalid User or User Inactive !";

        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT'
        ];

        $payload = [
            'user_id' => $aUser['user_id'],
            'email' => $aUser['email'],
            'company_id' => $company_id,
            'company_branch_id' => $company_branch_id,
            'permission_id' => json_encode($aUser['permission_id']),
            'r' => rand(111111, 999999),
            'exp' => time() + 60 * 60 * 24
        ];
        $token = self::generate_token($header, $payload);
        $aUser['api_token'] = $token;
        $aUser['company_id'] = $company_id;
        $aUser['company_name'] = $company['name'];
        $aUser['company_branch_id'] = $company_branch_id;
        $aUser['company_branch_name'] = $company_branch['name'];
        $aUserGroup = UserPermission::where('user_permission_id', $aUser['permission_id'])->select('user_permission_id', 'permission')->first();
        $aUser['permission'] = (empty($aUserGroup)) ? null : json_decode($aUserGroup['permission']);
        
        unset($aUser['password']);
        $userTokenUpdate = User::where('user_id', $aUser['user_id'])->firstOrFail();
        $userTokenUpdate->api_token = $aUser['api_token'];
        $userTokenUpdate->last_login = date('Y-m-d H:i:s');
        $userTokenUpdate->update();
        return $aUser;
    }


    public static function generate_token($headers, $payload)
    {
        $headers_encoded = self::base64url_encode(json_encode($headers));
        $payload_encoded = self::base64url_encode(json_encode($payload));
        $signature = hash_hmac('SHA256', "$headers_encoded.$payload_encoded", self::$secret, true);
        $signature_encoded = self::base64url_encode($signature);
        $token = "$headers_encoded.$payload_encoded.$signature_encoded";

        return $token;
    }

    public static function is_token_valid($token)
    {
        // split the jwt
        $tokenParts = explode('.', $token);

        if (count($tokenParts) < 2) {
            return FALSE;
        }
        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1] ?? "");
        $signature_provided = $tokenParts[2] ?? "";


        // check the expiration time - note this will cause an error if there is no 'exp' claim in the jwt
        $expiration = json_decode($payload)->exp ?? "";
        $permissionId = json_decode($payload)->permission_id;
        $permissionId = json_decode($permissionId);

        // $db_name = json_decode($payload)->db_name;
        $is_token_expired = ($expiration - time()) < 0;

        // build a signature based on the header and payload using the secret
        $base64_url_header = self::base64url_encode($header);
        $base64_url_payload = self::base64url_encode($payload);
        $signature = hash_hmac('SHA256', $base64_url_header . "." . $base64_url_payload, self::$secret, true);
        $base64_url_signature = self::base64url_encode($signature);

        // verify it matches the signature provided in the jwt
        $is_signature_valid = ($base64_url_signature === $signature_provided);

        if ($is_token_expired || !$is_signature_valid) {
            return FALSE;
        } else {
            // $payload = json_decode($payload);
            // unset($payload->permission_id);
            return $payload;
            // return $payload;
        }
    }

    public static function base64url_encode($str)
    {
        return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
    }
}
