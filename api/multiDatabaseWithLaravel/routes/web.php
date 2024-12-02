<?php
use Illuminate\Support\Facades\Route;
/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

// $router->get('/',['Middleware'=>['auth'], function () use ($router) {
//     return $router->app->version();
  
// }]);

$router->get('/', 'UserController@testApi');
$router->post('auth/login', 'AuthController@login');
$router->post('auth/session', 'AuthController@session');
$router->post('auth/logout', 'AuthController@logout');
$router->post('auth/check-admin', 'AuthController@checkAdmin');
$router->post('auth/refresh', 'AuthController@refresh');
$router->post('auth/profile', 'AuthController@me');
$router->post('auth/change-password', 'AuthController@changePassword');



// Route::post('auth/login', 'AuthController@login');