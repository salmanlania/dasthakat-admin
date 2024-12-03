<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use App\Models\UserToken;
use App\Models\UserPermission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
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
        'auth/login',
        'auth/session',
        'auth/refresh',
        'auth/logout',
        'auth/verify-email',
        'reset-password'
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
        
        
        if (in_array($request->path(), $this->except)) {
            return $next($request);
        }
        
        $access_token = $request->header('Authorization');
         $access_token = str_replace('access_token ', '', $access_token);
	     $access_token = str_replace('Bearer ', '', $access_token);
         $exist = UserToken::where('api_token', $access_token)->first();
	     $token_get_permission_id = UserToken::is_token_valid($access_token);
	 
         if (!$exist || empty($access_token) || !($token_get_permission_id) ) {
             return response()->json([
                 'message' => 'Unauthorized',
                 'status' => 'Authentication Failed',
                 'status_code' => 401
             ], 401);
         }
         // get Permission
         $userPermission = UserPermission::where('user_permission_id',$token_get_permission_id)
         ->select('user_permission_id','permission')->first();
         
         $permission = (empty($userPermission))? null : json_decode($userPermission['permission'], true);
         $request['permission_list'] = $permission;
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
