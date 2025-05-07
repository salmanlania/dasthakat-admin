<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserBranchAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
	protected $db;


	public function index(Request $request)
	{

		$user_name = $request->input('user_name', '');
		$user_type = $request->input('user_type', '');
		$email =  $request->input('email', '');
		$permission_id =  $request->input('permission_id', '');
		$status =  $request->input('status', '');
		$all =  $request->input('all', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'user.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$users = User::Join('user_permission as p', 'p.user_permission_id', '=', 'user.permission_id');
		$users = $users->where('user.company_id', '=',   $request->company_id);
		if (!empty($user_name)) $users = $users->where('user_name', 'like', '%' . $user_name . '%');
		if (!empty($permission_id)) $users = $users->where('user.permission_id', '=', $permission_id);
		if (!empty($user_type)) $users = $users->where('user.user_type', '=', $user_type);
		if (!empty($email)) $users = $users->where('email', 'like', '%' . $email . '%');
		if ($all != 1) $users = $users->where('status', '=', 1);
		if (!empty($status) || $status == '0') $users = $users->where('status', '=', $status);
		
		if (!empty($search)) {
			$search = strtolower($search);
			$users = $users->where(function ($query) use ($search) {
				$query
					->where('user_name', 'like', '%' . $search . '%')
					->orWhere('user_type', 'like', '%' . $search . '%')
					->orWhere('email', 'like', '%' . $search . '%')
					->orWhere('user.created_at', 'like', '%' . $search . '%');
			});
		}

		$users = $users->select("user.company_id", "user.user_id", "p.name as permission_name", "user.permission_id", "user.user_name", "user.email", "user.image", "user.status", "user.from_time", "user.to_time", "user.last_login", "user.created_by", "user.created_at", "user.updated_by", "user.updated_at", "user.user_type","user.is_exempted");
		$users =  $users->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($users);
	}

	public function show($id, Request $request)
	{
		$user = User::with('permission:user_permission_id,name');
		$user = $user->where('user_id', $id);
		$user = $user->where('company_id', '=',   $request->company_id);
		$user = $user->first();
		$user['image_url']  = !empty($user['image']) ?  url('public/uploads/' . $user['image']) : '';

		$access = UserBranchAccess::where('user_id', '=', $id)->select("company_id", "company_branch_id as branch_id")->get();
		$user['company_access'] = $access;

		return $this->jsonResponse($user, 200, "User Data");
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'company_id' => 'required',
			'user_name' => ['required', Rule::unique('user')->ignore($id, 'user_id')->where('company_id', $request['company_id'])],
			'email' => ['required', Rule::unique('user')->ignore($id, 'user_id')->where('company_id', $request['company_id'])],
			'permission_id' => 'required',
		];

		if (!empty($request['password']) || !$id) {
			$rules['password'] = 'required|min:8';
		}


		$validator = Validator::make($request, $rules);
		$response = [];
		if ($validator->fails()) {
			$response =  $errors = $validator->errors()->all();
			$firstError = $validator->errors()->first();
			return  $firstError;
		}
		return [];
	}



	public function store(Request $request)
	{

		if (!isPermission('add', 'user', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");
		$data      = $request->all();
		$imageData = $data['image'] ?? "";
		$image = "";
		if (isset($imageData) && !empty($imageData))
			$image = $this->base64ToImage($imageData);
		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'user_id' => $uuid,
			'permission_id' => $request->permission_id,
			'password' => md5($request->password),
			'user_name' => $request->user_name ?? "",
			'user_type' => $request->user_type ?? "",
			'email' => $request->email,
			'status' => $request->status ?? 0,
			'from_time' => $request->from_time,
			'to_time' => $request->to_time,
			'is_exempted' => $request->is_exempted ?? 0,
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];
		foreach ($request->company_access as $key => $value) {
			$accessUUID = $this->get_uuid();
			$insertAccess = [
				'user_branch_access_id' => $accessUUID,
				'company_id' =>  $value['company_id'] ?? "",
				'company_branch_id' => $value['branch_id'] ?? "",
				'user_id' => $uuid,
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $request->login_user_id,
			];
			UserBranchAccess::create($insertAccess);
		}

		if (isset($imageData) && !empty($imageData))
			$insertArr['image'] =  $image;

		$user = User::create($insertArr);

		return $this->jsonResponse(['user_id' => $uuid], 200, "Add User Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'user', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data      = $request->all();
		$imageData = $data['image'];
		$image = "";
		if (isset($imageData) && !empty($imageData))
			$image = $this->base64ToImage($imageData);


		$user  = User::where('user_id', $id)->first();
		$user->company_id  = $request->company_id ?? "";
		$user->user_name  = $request->user_name ?? "";
		$user->user_type  = $request->user_type ?? "";
		$user->email = $request->email;
		$user->permission_id = $request->permission_id;
		$user->status = $request->status ?? 0;
		$user->from_time = $request->from_time;
		$user->to_time = $request->to_time;
		$user->is_exempted = $request->is_exempted ?? 0;
		$user->updated_at = date('Y-m-d H:i:s');
		$user->updated_by = $request->login_user_id;


		//Delete Images

		if (deleteFile($request->delete_image)) {
			$user->image = null;
		}
		if (isset($imageData) && !empty($imageData)) {
			$user->image = $image;
		}

		if (!empty($request->password)) {
			$user->password = md5($request->password);
		}

		UserBranchAccess::where('user_id', $id)->delete();
		foreach ($request->company_access as $key => $value) {
			$accessUUID = $this->get_uuid();
			$insertAccess = [
				'user_branch_access_id' => $accessUUID,
				'company_id' => $value['company_id'] ?? "",
				'company_branch_id' => $value['branch_id'] ?? "",
				'user_id' => $id,
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $request->login_user_id,
			];
			UserBranchAccess::create($insertAccess);
		}

		$user->update();


		return $this->jsonResponse(['user_id' => $id], 200, "Update User Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'user', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$user  = User::where('user_id', $id)->first();
		if (!$user) return $this->jsonResponse(['user_id' => $id], 404, "User Not Found!");

		deleteFile($user->image);

		$user->delete();
		UserBranchAccess::where('user_id', $id)->delete();

		return $this->jsonResponse(['user_id' => $id], 200, "Delete User Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'user', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->user_ids) && !empty($request->user_ids) && is_array($request->user_ids)) {
				foreach ($request->user_ids as $user_id) {
					$user = User::where(['user_id' => $user_id])->first();
					//Delete Images
					$user  = User::where('user_id', $user_id)->first();
					deleteFile($user->image);
					UserBranchAccess::where('user_id', $user_id)->delete();
					$user->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Users successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
