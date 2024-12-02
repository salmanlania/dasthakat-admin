<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Models\User;

class Controller extends BaseController
{
   

    public function __construct(DatabaseManager $db)
    {
        $this->db = $db;
        $this->middleware('auth:api', ['except' => ['login','session', 'refresh', 'logout']]);
    }
    public function testApi()
    {
        // $users = $this->dbset()->get();
         $users = OtherModel::get();


         return response()->json( $users);
    }
    /**
     * --------------------------------------------------------------------------------
     * Get all api response
     * --------------------------------------------------------------------------------
     */
    protected function apiResponse($data = [], $status = 200, $message = 'success') : object
    {
        return response()->json([
            'message' => $message,
            'status' => $this->getStatusName($status),
            'status_code' => $status,
            'employee' => $data
        ], $status);
    }

    protected function jsonResponse($data = [], $status_code = 200, $message = '') : object
    {
        return response()->json([
            'message' => $message,
            'status' => $this->getStatusName($status_code),
            'status_code' => $status_code,
            'data' => $data
        ], $status_code);

        
    }
    /**
     * --------------------------------------------------------------------------------
     * Response with token
     * --------------------------------------------------------------------------------
     */
    protected function apiResponseWithToken($data, $token, $message = '') : object
    {
        return response()->json([
            'message' => $message,
            'status' => $this->getStatusName(200),
            'status_code' => 200,
            'token_type' => $token->type,
            'token' => $token->access_token,
            'employee' => $data,
            'expires_in' => $token->expiry
        ], 200);
    }


    /**
     * --------------------------------------------------------------------------------
     * Get status name
     * --------------------------------------------------------------------------------
     */
    private function getStatusName(int $code) : string
    {        
        $status = [
            200 => 'Success',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            500 => 'Internal Server Error',
        ];

        return $status[$code];

    }

    // public function dbset(){
    //     return $this->db->connection('other_connection')->table('user');
    // }
}