<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\OtherModel;

class UserController extends Controller
{
	 protected $db;

    

    public function testApi()
    {
        // $users = $this->dbset()->get();
         $users = OtherModel::get();

         return response()->json( $users);
    }



}
