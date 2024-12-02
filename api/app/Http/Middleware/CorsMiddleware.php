<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
       //Intercepts OPTIONS requests
        if($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            // Pass the request to the next middleware
            $response = $next($request);
        }

        // Adds headers to the response
       $response->header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
       $response->header('Access-Control-Allow-Credentials', 'true');
        $response->header('Access-Control-Allow-Headers',' Origin, Content-Type, Accept, Authorization, X-Request-With');
        $response->header('Access-Control-Allow-Origin', 'http://localhost:5173');

        // Sends it
        return $response;
    }
}