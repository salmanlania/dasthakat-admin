<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use App\Models\UserToken;
use App\Models\UserPermission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

use function PHPSTORM_META\type;

class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;
    
        protected $except = [
            'test',
            '/',
            'deploy/migrations',
            'setting/dbbackup',
            'deploy/seeders',
            'auth/login',
            'auth/session',
            'auth/verify',
            'auth/refresh',
            'auth/logout',
            'auth/verify-email',
            'vendor-platform/quotation/vendor/*',
            'vendor-platform/quotation/rfq/*',
            'vendor-platform/charge-order/vendor/*',
            'vendor-platform/charge-order/rfq/*',
            'charge-order/*'
        ];


    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Contracts\Auth\Factory  $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        
        foreach ($this->except as $route) {
            if ($request->is($route)) {
            return $next($request);
        }
    }
        
        $access_token = $request->header('Authorization');
         $access_token = str_replace('access_token ', '', $access_token);
	     $access_token = str_replace('Bearer ', '', $access_token);
         $exist = UserToken::where('api_token', $access_token)->first();
	     $payload = UserToken::is_token_valid($access_token);

         $payload = json_decode($payload);
         $token_get_permission_id = json_decode($payload->permission_id??"");
         
         $currentTime = date("H:i:s");
         $fromTime = $exist['from_time'] ?? '00:00:00';
         $toTime = $exist['to_time'] ?? '23:59:59';
         if (!$exist || empty($access_token) || !($token_get_permission_id) || ($currentTime < $fromTime || $currentTime > $toTime) ) {
             return response()->json([
                 'message' => 'Unauthorized',
                 'status' => 'Authentication Failed',
                 'status_code' => 401
                ], 401);
            }
         // get Permission
         $userPermission = UserPermission::where('user_permission_id',$token_get_permission_id)->first();
         $permission = (empty($userPermission))? null : json_decode($userPermission['permission'], true);
         $request['permission_list'] = $permission;
         $request['company_id'] = $payload->company_id;
         $request['company_branch_id'] = $payload->company_branch_id;
         $request['user'] = $exist;
         $request['login_user_id'] = $payload->user_id;
         //  $this->switchToYearlyDatabase( $db_name);
        return $next($request);
    }
    
    
       public function switchToYearlyDatabase($db_name) {
       
	    // Construct the database name based on the current year
	     $databaseName = $db_name;

	    // Update the configuration with the new database name
	     config(['database.connections.detail.database' => $databaseName]);

	    // Clear the existing database connection
	    DB::purge('detail');
    
	    // Reconnect with the new configuration
	    DB::reconnect('detail');
	}


}
