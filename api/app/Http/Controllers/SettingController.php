<?php

namespace App\Http\Controllers;

use App\Models\Accounts;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class SettingController extends Controller
{
	protected $db;
	public function update(Request $request)
	{
		$post = $request->only(['mail', 'sms', 'whatsapp', 'inventory_accounts_setting', 'gl_accounts_setting']);
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

	public function show()
	{
		$setting = Setting::get();

		if ($setting->isNotEmpty()) {
			foreach ($setting as $key => $value) {
				$decoded = json_decode($value->value, true);

				if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
					if ($this->isAccountIdArray($decoded)) {
						$accounts = Accounts::whereIn('account_id', $decoded)
							->get(['account_id', 'account_code', 'name']);
						$value->value = $accounts;
					} else {
						$value->value = $decoded;
					}
				}
			}
		}

		return $this->jsonResponse($setting, 200, "Setting Data");
	}

	/**
	 * Check if array looks like account_id list
	 */
	private function isAccountIdArray(array $arr): bool
	{
		// crude check: all elements are strings of similar length (UUID/char(36))
		return !empty($arr) && collect($arr)->every(fn($v) => is_string($v) && strlen($v) >= 10);
	}



	public function DBBackup()
	{
		ini_set('max_execution_time', 0);
		ini_set('memory_limit', -1);

		$fileName = 'backup_database_' . date('Y_m_d_H_i_s') . '.sql';
		$backupPath = database_path('backups');

		// Ensure directory exists
		if (!File::exists($backupPath)) {
			File::makeDirectory($backupPath, 0755, true);
		}

		$fileFullPath = $backupPath . '/' . $fileName;

		$database = env('DB_DATABASE');
		$excludedTables = [];

		$sqlContent = '';

		// Get all tables
		$tables = DB::select("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
		$tableKey = 'Tables_in_' . $database;

		foreach ($tables as $tableObj) {
			$table = $tableObj->$tableKey;

			if (str_starts_with($table, 'vw_') || in_array($table, $excludedTables)) {
				continue;
			}

			$sqlContent .= "DROP TABLE IF EXISTS `$table`;\n";

			$create = DB::select("SHOW CREATE TABLE `$table`");
			$sqlContent .= $create[0]->{'Create Table'} . ";\n\n";

			$rows = DB::table($table)->get();
			foreach ($rows as $row) {
				$columns = array_map(fn($col) => "`$col`", array_keys((array)$row));
				$values = array_map(function ($val) {
					if (is_null($val)) return 'NULL';
					return "'" . str_replace("'", "''", $val) . "'";
				}, array_values((array)$row));

				$sqlContent .= "INSERT INTO `$table` (" . implode(", ", $columns) . ") VALUES (" . implode(", ", $values) . ");\n";
			}

			$sqlContent .= "\n\n";
		}

		// Write content to file
		File::put($fileFullPath, $sqlContent);

		// Generate download URL
		$downloadUrl = url('database/backups/' . $fileName);

		return $this->jsonResponse([
			'status' => 'success',
			'message' => 'Database backup created successfully.',
			'file_path' => $fileFullPath,
			'download_url' => $downloadUrl
		]);
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
		$response = $this->sendEmail($data);
		if (!empty($response))
			return $this->jsonResponse($response, 400, "Invalid Email / Configuration!");
		else
			return $this->jsonResponse("Email Sent", 200, "Email Sent Successfully!");
	}
}
