<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
	protected $db;
	public function update(Request $request)
	{
		$post = $request->only(['mail', 'sms']);
		foreach ($post as $module_name => $data) {
			Setting::where('module', $module_name)->delete();
			if (is_array($data) || is_object($data))
				foreach ($data as $field => $value) {

					$uuid = $this->get_uuid();
					$iData = [
						'id' =>  $uuid,
						'module' => $module_name,
						"field" => $field,
						"value" =>  is_array($value) || is_object($value) ? json_encode($value) : $value,
					];
					Setting::create($iData);
				}
		}
		return $this->jsonResponse('Updated', 200, "Update Setting Successfully!");
	}


	public function show(Request $request)
	{
		$setting = Setting::get();
		$result = null;
		if (!empty($setting)) {
			$result = $setting;
		}


		// $model = new Setting();
		// $result['email_details'] = $model->getEmailKeys();

		return $this->jsonResponse($result, 200, "Setting Data");
	}
	public function EmailDubugging(Request $request)
	{
		$setting = Setting::where('module', 'mail')->pluck('value', 'field');
		if (empty($setting)) return $this->jsonResponse("Email Settings not Found.", 400, "Configuration Missing!");

		$data = [
			'template' => 'test-template',
			'name' => 'Welcome ' . @$setting['display_name'],
			'subject' => 'Testing Email',
			'message' => 'Testing Email is Working!'
		];
		$response = $this->sentMail($data);
		if (!empty($response))
			return $this->jsonResponse($response, 400, "Invalid Email / Configuration!");
		else
			return $this->jsonResponse("Email Sent", 200, "Email Sent Successfully!");
	}
}
