<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use App\Models\UserToken;
use Illuminate\Support\Facades\DB;
class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

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
         $access_token = $request->header('Authorization');
         $access_token = str_replace('access_token ', '', $access_token);
         $exist = UserToken::where('api_token', $access_token)->first();
	 $db_name = UserToken::is_token_valid($access_token);

         if (!$exist || empty($access_token) || !($db_name) ) {
             return response()->json([
                 'message' => 'Unauthorized',
                 'status' => 'Faild Login',
                 'status_code' => 401
             ], 401);
         }
	 
        $this->switchToYearlyDatabase( $db_name);
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
