<?php


/** @var \Laravel\Lumen\Routing\Router $router */

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;


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


$router->group([
   'middleware' => ['cors'],
], function ($router) {});

$router->group(['prefix' => 'deploy'], function ($router) {
   $router->get('/migrations', 'DeployController@runMigrations');
   $router->get('/seeders', 'DeployController@runSeeders');
});

$router->get('test', 'Controller@testApi');

$router->group(['prefix' => 'auth'], function ($router) {
   $router->post('/login', 'AuthController@login');
   $router->post('/session', 'AuthController@session');
   $router->post('/verify', 'AuthController@verify');
   $router->post('/logout', 'AuthController@logout');
   $router->post('/reset-password', 'AuthController@forgotPassword');
});
$router->group(['prefix' => 'ledger'], function ($router) {
   $router->get('/document-ledger', 'LedgerController@getDocumentLedger');
});

$router->group(['prefix' => 'audit'], function ($router) {
   $router->get('/', 'AuditController@index');
   $router->get('/{id}', 'AuditController@show');
});

$router->group(['prefix' => 'setting'], function ($router) {
   $router->put('/', 'SettingController@update');
   $router->get('/', 'SettingController@show');
   $router->get('dbbackup/', 'SettingController@DBBackup');
   $router->get('/test-mail', 'SettingController@EmailDubugging');
});

$router->group(['prefix' => 'user'], function ($router) {
   $router->get('/', 'UserController@index');
   $router->get('/{id}', 'UserController@show');
   $router->post('/', 'UserController@store');
   $router->put('/{id}', 'UserController@update');
   $router->delete('/{id}', 'UserController@delete');
   $router->post('/bulk-delete', 'UserController@bulkDelete');
});

$router->group(['prefix' => 'permission'], function ($router) {
   $router->get('/', 'PermissionController@index');
   $router->get('/{id}', 'PermissionController@show');
   $router->post('/', 'PermissionController@store');
   $router->put('/{id}', 'PermissionController@update');
   $router->delete('/{id}', 'PermissionController@delete');
   $router->post('/bulk-delete', 'PermissionController@bulkDelete');
});

$router->group(['prefix' => 'company'], function ($router) {
   $router->get('/', 'CompanyController@index');
   $router->get('/{id}', 'CompanyController@show');
   $router->post('/', 'CompanyController@store');
   $router->put('/{id}', 'CompanyController@update');
   $router->delete('/{id}', 'CompanyController@delete');
   $router->post('/bulk-delete', 'CompanyController@bulkDelete');
});

$router->group(['prefix' => 'company-branch'], function ($router) {
   $router->get('/', 'CompanyBranchController@index');
   $router->get('/{id}', 'CompanyBranchController@show');
   $router->post('/', 'CompanyBranchController@store');
   $router->put('/{id}', 'CompanyBranchController@update');
   $router->delete('/{id}', 'CompanyBranchController@delete');
   $router->post('/bulk-delete', 'CompanyBranchController@bulkDelete');
});

$router->group(['prefix' => 'customer'], function ($router) {
   $router->get('/', 'CustomerController@index');
   $router->get('/{id}/ledger-invoices', 'CustomerController@getLedgerInvoices');
   $router->get('/{id}', 'CustomerController@show');
   $router->post('/', 'CustomerController@store');
   $router->put('/{id}', 'CustomerController@update');
   $router->put('/{id}/commission-agents', 'CustomerController@updateCommissionAgent');
   $router->delete('/{id}', 'CustomerController@delete');
   $router->post('/bulk-delete', 'CustomerController@bulkDelete');
});

$router->group(['prefix' => 'supplier'], function ($router) {
   $router->get('/', 'SupplierController@index');
   $router->get('/{id}', 'SupplierController@show');
   $router->post('/', 'SupplierController@store');
   $router->put('/{id}', 'SupplierController@update');
   $router->delete('/{id}', 'SupplierController@delete');
   $router->post('/bulk-delete', 'SupplierController@bulkDelete');
});

$router->group(['prefix' => 'agent'], function ($router) {
   $router->get('/', 'AgentController@index');
   $router->get('/{id}', 'AgentController@show');
   $router->post('/', 'AgentController@store');
   $router->put('/{id}', 'AgentController@update');
   $router->delete('/{id}', 'AgentController@delete');
   $router->post('/bulk-delete', 'AgentController@bulkDelete');
});

$router->group(['prefix' => 'sales-team'], function ($router) {
   $router->get('/', 'SalesTeamController@index');
   $router->get('/{id}', 'SalesTeamController@show');
   $router->post('/', 'SalesTeamController@store');
   $router->put('/{id}', 'SalesTeamController@update');
   $router->delete('/{id}', 'SalesTeamController@delete');
   $router->post('/bulk-delete', 'SalesTeamController@bulkDelete');
});

$router->group(['prefix' => 'commission-agent'], function ($router) {
   $router->get('/', 'CommissionAgentController@index');
   $router->get('/{id}', 'CommissionAgentController@show');
   $router->post('/', 'CommissionAgentController@store');
   $router->put('/{id}', 'CommissionAgentController@update');
   $router->delete('/{id}', 'CommissionAgentController@delete');
   $router->post('/bulk-delete', 'CommissionAgentController@bulkDelete');
});

$router->group(['prefix' => 'technician'], function ($router) {
   $router->get('/', 'TechnicianController@index');
   $router->get('/{id}', 'TechnicianController@show');
   $router->post('/', 'TechnicianController@store');
   $router->put('/{id}', 'TechnicianController@update');
   $router->delete('/{id}', 'TechnicianController@delete');
   $router->post('/bulk-delete', 'TechnicianController@bulkDelete');
});

$router->group(['prefix' => 'flag'], function ($router) {
   $router->get('/', 'FlagController@index');
   $router->get('/{id}', 'FlagController@show');
   $router->post('/', 'FlagController@store');
   $router->put('/{id}', 'FlagController@update');
   $router->delete('/{id}', 'FlagController@delete');
   $router->post('/bulk-delete', 'FlagController@bulkDelete');
});

$router->group(['prefix' => 'class'], function ($router) {
   $router->get('/', 'ClassController@index');
   $router->get('/{id}', 'ClassController@show');
   $router->post('/', 'ClassController@store');
   $router->put('/{id}', 'ClassController@update');
   $router->delete('/{id}', 'ClassController@delete');
   $router->post('/bulk-delete', 'ClassController@bulkDelete');
});

$router->group(['prefix' => 'port'], function ($router) {
   $router->get('/', 'PortController@index');
   $router->get('/{id}', 'PortController@show');
   $router->post('/', 'PortController@store');
   $router->put('/{id}', 'PortController@update');
   $router->delete('/{id}', 'PortController@delete');
   $router->post('/bulk-delete', 'PortController@bulkDelete');
});

$router->group(['prefix' => 'vessel'], function ($router) {
   $router->get('/', 'VesselController@index');
   $router->get('/{id}', 'VesselController@show');
   $router->post('/', 'VesselController@store');
   $router->put('/{id}', 'VesselController@update');
   $router->put('/{id}/commission-agents', 'VesselController@updateCommissionAgent');
   $router->delete('/{id}', 'VesselController@delete');
   $router->post('/bulk-delete', 'VesselController@bulkDelete');
});

$router->group(['prefix' => 'event'], function ($router) {
   $router->get('/', 'EventController@index');
   $router->get('/{id}', 'EventController@show');
   $router->get('/{id}/charge-orders', 'EventController@getChargeOrders');
   $router->get('/{id}/job-orders', 'EventController@EventJobOrders');
   $router->get('/{id}/service-orders', 'EventController@EventServiceOrders');
   $router->get('/{id}/picklists', 'EventController@EventChargeOrdersWithPicklists');
   $router->post('/', 'EventController@store');
   $router->put('/{id}', 'EventController@update');
   $router->delete('/{id}', 'EventController@delete');
   $router->post('/bulk-delete', 'EventController@bulkDelete');
});

$router->group(['prefix' => 'shipment'], function ($router) {
   $router->get('/', 'ShipmentController@index');
   $router->get('/view-before-create', 'ShipmentController@viewBeforeShipment');
   $router->get('/{id}', 'ShipmentController@show');
   $router->post('/', 'ShipmentController@store');
   $router->delete('/{id}', 'ShipmentController@delete');
   $router->post('/bulk-delete', 'ShipmentController@bulkDelete');
});

$router->group(['prefix' => 'event-dispatch'], function ($router) {
   $router->get('/', 'EventDispatchController@index');
   $router->put('/{id}', 'EventDispatchController@update');
});

$router->group(['prefix' => 'terms'], function ($router) {
   $router->get('/', 'TermsController@index');
   $router->get('/{id}', 'TermsController@show');
   $router->post('/', 'TermsController@store');
   $router->put('/{id}', 'TermsController@update');
   $router->delete('/{id}', 'TermsController@delete');
   $router->post('/bulk-delete', 'TermsController@bulkDelete');
});

$router->group(['prefix' => 'validity'], function ($router) {
   $router->get('/', 'ValidityController@index');
   $router->get('/{id}', 'ValidityController@show');
   $router->post('/', 'ValidityController@store');
   $router->put('/{id}', 'ValidityController@update');
   $router->delete('/{id}', 'ValidityController@delete');
   $router->post('/bulk-delete', 'ValidityController@bulkDelete');
});

$router->group(['prefix' => 'payment'], function ($router) {
   $router->get('/', 'PaymentController@index');
   $router->get('/{id}', 'PaymentController@show');
   $router->post('/', 'PaymentController@store');
   $router->put('/{id}', 'PaymentController@update');
   $router->delete('/{id}', 'PaymentController@delete');
   $router->post('/bulk-delete', 'PaymentController@bulkDelete');
});

$router->group(['prefix' => 'category'], function ($router) {
   $router->get('/', 'CategoryController@index');
   $router->get('/{id}', 'CategoryController@show');
   $router->post('/', 'CategoryController@store');
   $router->put('/{id}', 'CategoryController@update');
   $router->delete('/{id}', 'CategoryController@delete');
   $router->post('/bulk-delete', 'CategoryController@bulkDelete');
});
$router->group(['prefix' => 'sub-category'], function ($router) {
   $router->get('/', 'SubCategoryController@index');
   $router->get('/{id}', 'SubCategoryController@show');
   $router->post('/', 'SubCategoryController@store');
   $router->put('/{id}', 'SubCategoryController@update');
   $router->delete('/{id}', 'SubCategoryController@delete');
   $router->post('/bulk-delete', 'SubCategoryController@bulkDelete');
});

$router->group(['prefix' => 'brand'], function ($router) {
   $router->get('/', 'BrandController@index');
   $router->get('/{id}', 'BrandController@show');
   $router->post('/', 'BrandController@store');
   $router->put('/{id}', 'BrandController@update');
   $router->delete('/{id}', 'BrandController@delete');
   $router->post('/bulk-delete', 'BrandController@bulkDelete');
});

$router->group(['prefix' => 'product'], function ($router) {
   $router->get('/', 'ProductController@index');
   $router->get('/{id}', 'ProductController@show');
   $router->get('getProductByCode/{id}', 'ProductController@show');
   $router->post('/', 'ProductController@store');
   $router->put('/{id}', 'ProductController@update');
   $router->delete('/{id}', 'ProductController@delete');
   $router->post('/bulk-delete', 'ProductController@bulkDelete');
});

$router->group(['prefix' => 'salesman'], function ($router) {
   $router->get('/', 'SalesmanController@index');
   $router->get('/{id}', 'SalesmanController@show');
   $router->post('/', 'SalesmanController@store');
   $router->put('/{id}', 'SalesmanController@update');
   $router->delete('/{id}', 'SalesmanController@delete');
   $router->post('/bulk-delete', 'SalesmanController@bulkDelete');
});

$router->group(['prefix' => 'unit'], function ($router) {
   $router->get('/', 'UnitController@index');
   $router->get('/{id}', 'UnitController@show');
   $router->post('/', 'UnitController@store');
   $router->put('/{id}', 'UnitController@update');
   $router->delete('/{id}', 'UnitController@delete');
   $router->post('/bulk-delete', 'UnitController@bulkDelete');
});

$router->group(['prefix' => 'currency'], function ($router) {
   $router->get('/', 'CurrencyController@index');
   $router->get('/{id}', 'CurrencyController@show');
   $router->post('/', 'CurrencyController@store');
   $router->put('/{id}', 'CurrencyController@update');
   $router->delete('/{id}', 'CurrencyController@delete');
   $router->post('/bulk-delete', 'CurrencyController@bulkDelete');
});

$router->group(['prefix' => 'warehouse'], function ($router) {
   $router->get('/', 'WarehouseController@index');
   $router->get('/{id}', 'WarehouseController@show');
   $router->post('/', 'WarehouseController@store');
   $router->put('/{id}', 'WarehouseController@update');
   $router->delete('/{id}', 'WarehouseController@delete');
   $router->post('/bulk-delete', 'WarehouseController@bulkDelete');
});

$router->group(['prefix' => 'lookups'], function ($router) {
   $router->get('/company', 'LookUpsController@getCompany');
   $router->get('/product-types', 'LookUpsController@getProductTypes');
   $router->get('/company-branch', 'LookUpsController@getCompanyBranch');
   $router->get('/company-and-branches', 'LookUpsController@getCompanyAndBranches');
   $router->get('/modules', 'LookUpsController@getModules');
   $router->get('/short-codes', 'LookUpsController@getShortCodes');
   $router->get('/gl-types', 'LookUpsController@getGlTypes');
   $router->get('/next-coa-level-code', 'LookUpsController@nextCoaLevelCode');
});

$router->group(['prefix' => 'quotation'], function ($router) {
   $router->get('/', 'QuotationController@index');
   $router->get('/{id}', 'QuotationController@show');
   $router->post('/', 'QuotationController@store');
   $router->put('/{id}', 'QuotationController@update');
   $router->delete('/{id}', 'QuotationController@delete');
   $router->post('/bulk-delete', 'QuotationController@bulkDelete');
});

$router->group(['prefix' => 'charge-order'], function ($router) {
   $router->get('/', 'ChargeOrderController@index');
   $router->get('/{id}', 'ChargeOrderController@show');
   $router->get('/{id}/analysis', 'ChargeOrderController@getDetailedAnalysis');
   $router->get('/{id}/vendor-wise-details', 'ChargeOrderController@getVendorWiseDetails');
   $router->post('/{id}/purchase-orders', 'ChargeOrderController@createPurchaseOrders');
   $router->post('/', 'ChargeOrderController@store');
   $router->put('/{id}', 'ChargeOrderController@update');
   $router->post('/actions', 'ChargeOrderController@actions');

   $router->delete('/{id}', 'ChargeOrderController@delete');
   $router->post('/bulk-delete', 'ChargeOrderController@bulkDelete');
});

$router->group(['prefix' => 'job-order'], function ($router) {
   $router->get('/', 'JobOrderController@index');
   $router->get('/{id}', 'JobOrderController@show');
   $router->post('/', 'JobOrderController@store');
   $router->put('/{id}/certificate', 'JobOrderController@generateCertificate');
   $router->put('/{id}', 'JobOrderController@update');
   $router->delete('/{id}', 'JobOrderController@delete');
   $router->post('/bulk-delete', 'JobOrderController@bulkDelete');
});

$router->group(['prefix' => 'sale-return'], function ($router) {
   $router->get('/', 'SaleReturnController@index');
   $router->get('/{id}', 'SaleReturnController@show');
   $router->post('/', 'SaleReturnController@store');
   $router->put('/{id}', 'SaleReturnController@update');
   $router->delete('/{id}', 'SaleReturnController@delete');
   $router->post('/bulk-delete', 'SaleReturnController@bulkDelete');
});
$router->group(['prefix' => 'stock-return'], function ($router) {
   $router->get('/', 'StockReturnController@index');
   $router->get('/{id}', 'StockReturnController@show');
   $router->post('/', 'StockReturnController@store');
   $router->post('/bulk-store', 'StockReturnController@bulkStore');
   $router->put('/{id}', 'StockReturnController@update');
   $router->delete('/{id}', 'StockReturnController@delete');
   $router->post('/bulk-delete', 'StockReturnController@bulkDelete');
});
$router->group(['prefix' => 'purchase-return'], function ($router) {
   $router->get('/', 'PurchaseReturnController@index');
   $router->get('/{id}', 'PurchaseReturnController@show');
   $router->post('/', 'PurchaseReturnController@store');
   $router->post('/bulk-store', 'PurchaseReturnController@bulkStore');
   $router->put('/{id}', 'PurchaseReturnController@update');
   $router->delete('/{id}', 'PurchaseReturnController@delete');
   $router->post('/bulk-delete', 'PurchaseReturnController@bulkDelete');
});

// pick list routes
$router->group(['prefix' => 'picklist'], function ($router) {
   $router->get('/', 'PicklistController@index');
   $router->get('/{id}', 'PicklistController@show');
   $router->post('/', 'PicklistController@store');
});

$router->group(['prefix' => 'picklist-received'], function ($router) {
   $router->get('/{id}', 'PicklistReceivedController@show');
   $router->put('/{id}', 'PicklistReceivedController@update');
});

// service list routes
$router->group(['prefix' => 'servicelist'], function ($router) {
   $router->get('/', 'ServicelistController@index');
   $router->get('/{id}', 'ServicelistController@show');
   $router->post('/', 'ServicelistController@store');
});

// service order routes
$router->group(['prefix' => 'service_order'], function ($router) {
   $router->get('/', 'ServiceOrderController@index');
   $router->get('/view-before-create', 'ServiceOrderController@viewBeforeServiceOrder');
   $router->get('/{id}', 'ServiceOrderController@show');
   $router->post('/', 'ServiceOrderController@store');
   $router->delete('/{id}', 'ServiceOrderController@delete');
   $router->post('/bulk-delete', 'ServiceOrderController@bulkDelete');
});

$router->group(['prefix' => 'servicelist-received'], function ($router) {
   $router->get('/{id}', 'ServicelistReceivedController@show');
   $router->put('/{id}', 'ServicelistReceivedController@update');
});

$router->group(['prefix' => 'purchase-order'], function ($router) {
   $router->get('/', 'PurchaseOrderController@index');
   $router->get('/{id}', 'PurchaseOrderController@show');
   $router->post('/', 'PurchaseOrderController@store');
   $router->put('/{id}', 'PurchaseOrderController@update');
   $router->delete('/{id}', 'PurchaseOrderController@delete');
   $router->post('/bulk-delete', 'PurchaseOrderController@bulkDelete');
   $router->post('/actions', 'PurchaseOrderController@actions');

});

$router->group(['prefix' => 'purchase-invoice'], function ($router) {
   $router->get('/', 'PurchaseInvoiceController@index');
   $router->get('/{id}', 'PurchaseInvoiceController@show');
   $router->post('/', 'PurchaseInvoiceController@store');
   $router->put('/{id}', 'PurchaseInvoiceController@update');
   $router->delete('/{id}', 'PurchaseInvoiceController@delete');
   $router->post('/bulk-delete', 'PurchaseInvoiceController@bulkDelete');
});

$router->group(['prefix' => 'sale-invoice'], function ($router) {
   $router->get('/', 'SaleInvoiceController@index');
   $router->get('/{id}', 'SaleInvoiceController@show');
   $router->post('/', 'SaleInvoiceController@store');
   $router->put('/{id}', 'SaleInvoiceController@update');
   $router->delete('/{id}', 'SaleInvoiceController@delete');
   $router->post('/bulk-delete', 'SaleInvoiceController@bulkDelete');
});

$router->group(['prefix' => 'good-received-note'], function ($router) {
   $router->get('/', 'GRNController@index');
   $router->get('/{id}', 'GRNController@show');
   $router->post('/', 'GRNController@store');
   $router->put('/{id}', 'GRNController@update');
   $router->delete('/{id}', 'GRNController@delete');
   $router->post('/bulk-delete', 'GRNController@bulkDelete');
});

$router->group(['prefix' => 'opening-stock'], function ($router) {
   $router->get('/', 'OpeningStockController@index');
   $router->get('/{id}', 'OpeningStockController@show');
   $router->post('upload/excel', 'OpeningStockController@storeExcel');
   $router->post('/', 'OpeningStockController@store');
   $router->put('/{id}', 'OpeningStockController@update');
   $router->delete('/{id}', 'OpeningStockController@delete');
   $router->post('/bulk-delete', 'OpeningStockController@bulkDelete');
});

$router->group(['prefix' => 'report'], function ($router) {
   $router->get('/quote-report', 'ReportsController@QuoteReport');
   $router->get('/bid-response', 'ReportsController@BidResponse');
   $router->get('/bid-success', 'ReportsController@BidSuccess');
});

$router->group(['prefix' => 'vendor-platform/quotation'], function ($router) {

   $router->get('/', 'VendorPlatform\VpQuotationRfqController@index');
   $router->post('/', 'VendorQuotationController@store');
   $router->get('/{id}', 'VendorQuotationController@show');
   $router->put('/vendor/{id}', 'VendorQuotationController@vendorUpdate');
   $router->post('/rfq', 'VendorQuotationController@sendRFQ');
   $router->get('/rfq/{id}', 'VendorQuotationController@fetchRFQ');
   $router->post('/actions', 'VendorPlatform\VpQuotationRfqController@actions');
});

$router->group(['prefix' => 'vendor-platform/charge-order'], function ($router) {

   $router->get('/', 'VendorPlatform\VpChargeOrderRfqController@index');
   $router->post('/', 'VendorChargeOrderController@store');
   $router->get('/{id}', 'VendorChargeOrderController@show');
   $router->put('/vendor/{id}', 'VendorChargeOrderController@vendorUpdate');
   $router->post('/rfq', 'VendorChargeOrderController@sendRFQ');
   $router->get('/rfq/{id}', 'VendorChargeOrderController@fetchRFQ');
   $router->post('/actions', 'VendorPlatform\VpChargeOrderRfqController@actions');
});

// Accounts routes
$router->group(['prefix' => 'accounts'], function ($router) {
    $router->get('/', 'AccountsController@index');
    $router->get('/account/heads', 'AccountsController@getAccountHeads');
    $router->get('/account/tree', 'AccountsController@getAccountsTree');
    $router->post('/', 'AccountsController@store');
    $router->post('/bulk-delete', 'AccountsController@bulkDelete');
    $router->get('/{id}', 'AccountsController@show');
    $router->put('/{id}', 'AccountsController@update');
    $router->delete('/{id}', 'AccountsController@delete');
});

// Accounts routes
$router->group(['prefix' => 'customer-payment'], function ($router) {
    $router->get('/', 'CustomerPaymentController@index');
    $router->post('/', 'CustomerPaymentController@store');
    $router->post('/bulk-delete', 'CustomerPaymentController@bulkDelete');
    $router->get('/{id}', 'CustomerPaymentController@show');
    $router->put('/{id}', 'CustomerPaymentController@update');
    $router->delete('/{id}', 'CustomerPaymentController@delete');
});

// Accounts routes
$router->group(['prefix' => 'payment-voucher'], function ($router) {
    $router->get('/', 'PaymentVoucherController@index');
    $router->post('/', 'PaymentVoucherController@store');
    $router->post('/bulk-delete', 'PaymentVoucherController@bulkDelete');
    $router->get('/{id}', 'PaymentVoucherController@show');
    $router->put('/{id}', 'PaymentVoucherController@update');
    $router->delete('/{id}', 'PaymentVoucherController@delete');
});

// COA Level1 routes
$router->group(['prefix' => 'coa-level1'], function ($router) {
    $router->get('/', 'CoaLevel1Controller@index');
    $router->get('/{id}', 'CoaLevel1Controller@show');
    $router->post('/', 'CoaLevel1Controller@store');
    $router->put('/{id}', 'CoaLevel1Controller@update');
    $router->delete('/{id}', 'CoaLevel1Controller@delete');
    $router->post('/bulk-delete', 'CoaLevel1Controller@bulkDelete');
});

// COA Level2 routes
$router->group(['prefix' => 'coa-level2'], function ($router) {
    $router->get('/', 'CoaLevel2Controller@index');
    $router->get('/{id}', 'CoaLevel2Controller@show');
    $router->post('/', 'CoaLevel2Controller@store');
    $router->put('/{id}', 'CoaLevel2Controller@update');
    $router->delete('/{id}', 'CoaLevel2Controller@delete');
    $router->post('/bulk-delete', 'CoaLevel2Controller@bulkDelete');
});

// COA Level3 routes
$router->group(['prefix' => 'coa-level3'], function ($router) {
    $router->get('/', 'CoaLevel3Controller@index');
    $router->get('/{id}', 'CoaLevel3Controller@show');
    $router->post('/', 'CoaLevel3Controller@store');
    $router->put('/{id}', 'CoaLevel3Controller@update');
    $router->delete('/{id}', 'CoaLevel3Controller@delete');
    $router->post('/bulk-delete', 'CoaLevel3Controller@bulkDelete');
});
