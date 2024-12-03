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


$router->group([
        'middleware' => ['cors'],
    ], function ($router) {
         
    });

$router->get('test', 'Controller@testApi');

$router->post('auth/login', 'AuthController@login');
$router->post('auth/session', 'AuthController@session');
$router->post('auth/logout', 'AuthController@logout');
// $router->post('auth/check-admin', 'AuthController@checkAdmin');
// $router->post('auth/refresh', 'AuthController@refresh');
// $router->post('auth/profile', 'AuthController@me');

// //forgot Password
// $router->post('auth/verify-email', 'AuthController@verifyEmail');
// $router->post('reset-password', 'AuthController@forgotPassword');

// // Test Route
// $router->get('/', 'UserController@testApi');

// // Dashboard
// $router->group(['prefix' => 'dashboard'], function ($router) {
//  $router->get('/', 'DashboardController@index');
// });

// // Users
$router->group(['prefix' => 'user'], function ($router) {
 $router->get('/', 'UserController@index');
 $router->get('/{id}', 'UserController@show');
 $router->post('/', 'UserController@store');
 $router->put('/{id}', 'UserController@update');
 $router->delete('/{id}', 'UserController@delete');
 $router->post('/bulk-delete', 'UserController@bulkDelete');
});
// $router->post('change-password', 'UserController@changePassword');


// // Permission 

$router->group(['prefix' => 'permission'], function ($router) {
   $router->get('/', 'PermissionController@index');
   $router->get('/{id}', 'PermissionController@show');
   $router->post('/', 'PermissionController@store');
   $router->put('/{id}', 'PermissionController@update');
   $router->delete('/{id}', 'PermissionController@delete');
   $router->post('/bulk-delete', 'PermissionController@bulkDelete');
});

$router->get('lookups/company', 'LookUpsController@getCompany');
$router->get('lookups/company-branch', 'LookUpsController@getCompanyBranch');
// $router->get('lookups/country', 'LookUpsController@getCountry');
// $router->get('lookups/modules', 'LookUpsController@getModules');
// $router->get('lookups/parlour-modules', 'LookUpsController@getParlourModules');
// $router->get('lookups/template-modules', 'LookUpsController@getModuleForEmail');

// // Banner
// $router->group(['prefix' => 'banner'], function ($router) {
//   $router->post('/', 'BannerController@store');
//   $router->get('/{id}', 'BannerController@show');
//   $router->put('/{id}', 'BannerController@update');
// });


// // Parlour Master
// $router->group(['prefix' => 'parlour-master'], function ($router) {
//   $router->get('/', 'ParlourMasterController@index');
//   $router->get('/{id}', 'ParlourMasterController@show');
//   $router->post('/', 'ParlourMasterController@store');
//   $router->put('/{id}', 'ParlourMasterController@update');
//   $router->delete('/{id}', 'ParlourMasterController@delete');
//   $router->post('/bulk-delete', 'ParlourMasterController@bulkDelete');
// });


// // Quote Request
// $router->group(['prefix' => 'request'], function ($router) {
//   $router->get('/', 'QuoteRequestController@index');
//   $router->get('/{id}', 'QuoteRequestController@show');
//   $router->post('/', 'QuoteRequestController@store');
//   $router->put('/{id}', 'QuoteRequestController@update');
//   $router->delete('/{id}', 'QuoteRequestController@delete');
//   $router->post('/bulk-delete', 'QuoteRequestController@bulkDelete');
//   $router->post('/add-assignee', 'QuoteRequestController@addAssignee');
//   $router->post('/change-assignee', 'QuoteRequestController@changeAssignee');
//   $router->post('/messages','QuoteRequestController@messages');
// });

// // Attribute
// $router->group(['prefix' => 'attribute'], function ($router) {
//   $router->get('/', 'AttributeController@index');
//   $router->get('/{id}', 'AttributeController@show');
//   $router->post('/', 'AttributeController@store');
//   $router->put('/{id}', 'AttributeController@update');
//   $router->delete('/{id}', 'AttributeController@delete');
//   $router->post('/bulk-delete', 'AttributeController@bulkDelete');
// });

// // Product Category
// $router->group(['prefix' => 'product-category'], function ($router) {
//   $router->get('/', 'ProductCategoryController@index');
//   $router->get('/{id}', 'ProductCategoryController@show');
//   $router->post('/', 'ProductCategoryController@store');
//   $router->put('/{id}', 'ProductCategoryController@update');
//   $router->delete('/{id}', 'ProductCategoryController@delete');
//   $router->post('/bulk-delete', 'ProductCategoryController@bulkDelete');
// });

// // Product
// $router->group(['prefix' => 'product'], function ($router) {
//   $router->get('/', 'ProductController@index');
//   $router->get('/{id}', 'ProductController@show');
//   $router->post('/', 'ProductController@store');
//   $router->put('/{id}', 'ProductController@update');
//   $router->delete('/{id}', 'ProductController@delete');
//   $router->post('/bulk-delete', 'ProductController@bulkDelete');
// });

// // Shop
// $router->group(['prefix' => 'shop'], function ($router) {
//   $router->get('/', 'ShopController@index');
//   $router->get('view-cart/', 'ShopController@viewCart');
//   $router->get('/{id}', 'ShopController@show');
//   $router->post('add-to-favorite', 'ShopController@addToFavorite');
//   $router->get('product-detail/{id}', 'ShopController@productDetail');
//   $router->post('add-to-cart/', 'ShopController@addToCart');
//   $router->post('update-cart/', 'ShopController@updateCart');
//   $router->delete('delete-cart-item/{id}', 'ShopController@deleteCartItem');
// });

// // Orders
// $router->group(['prefix' => 'order'], function ($router) {
//   $router->get('/', 'OrderController@index');
//   $router->post('/', 'OrderController@store');
//   $router->get('/{id}', 'OrderController@show');
//   $router->put('/{id}', 'OrderController@update');
//   $router->post('update-status/', 'OrderController@updateStatus');
//   $router->post('buy-again/', 'OrderController@buyAgain');
//   $router->get('generate-pdf/{id}', 'OrderController@generatePdf');
// });

// // Messages
// $router->group(['prefix' => 'messages'], function ($router) {
//    $router->get('/', 'MessageController@index');
// });

// // Notification
// $router->group(['prefix' => 'notification'], function ($router) {
//    $router->get('/', 'NotificationController@index');
//    $router->delete('/{id}', 'NotificationController@delete');
//    $router->post('/bulk-delete', 'NotificationController@bulkDelete');
//    $router->post('/read-all', 'NotificationController@readAll');
   
// });

//  //Logs
// $router->get('/log-history', 'QuoteRequestController@logList');

// // Setting
// $router->group(['prefix' => 'setting'], function ($router) {
//  $router->put('/{id}', 'SettingController@update');
//  $router->get('/{id}', 'SettingController@show');
//  $router->post('/email-debugging', 'SettingController@EmailDubugging');
// });

// // Setting
// $router->group(['prefix' => 'email-template'], function ($router) {
//  $router->get('/', 'EmailTemplateController@index');
//  $router->post('/', 'EmailTemplateController@store');
//  $router->get('/{id}', 'EmailTemplateController@show');
//  $router->put('/{id}', 'EmailTemplateController@update');
//  $router->delete('/{id}', 'EmailTemplateController@delete');
// });

// Route::post('auth/login', 'AuthController@login');