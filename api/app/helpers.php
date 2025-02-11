<?php

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Validator;


if (!function_exists('hello')) {

	/**
	 * say hello
	 *
	 * @param string $name
	 * @return string
	 */
	function hello($name)
	{
		return 'Hello ' . $name . '!';
	}
}


function deleteFile($path, $dir = 'public/uploads/')
{
	if (isset($path) && !empty($path)) {
		$file_path = base_path($dir . $path);
		if (file_exists($file_path)) {
			unlink($file_path);
			return true;
		}
	}
	return false;
}


function isPermission($type, $module, $permission)
{
	$_return = $permission[$module][$type] ?? "";
	if (empty($_return))
		return false;
	return true;
}


function getFormatedDate(string $fromFormat, string $strDatetime, string $toFormat): ?string
{
	$datetime = \DateTime::createFromFormat($fromFormat, $strDatetime);
	return $datetime ? $datetime->format($toFormat) : null;
}
function camelCaseToSpace($camelCaseString)
{
	return preg_replace('/([a-z0-9])([A-Z])/', '$1 $2', $camelCaseString);
}
function mysqlDate(string $strDate = ''): string
{
	$strDate = $strDate ?: date(\DateTimeInterface::ATOM);
	return getFormatedDate(\DateTimeInterface::ATOM, $strDate, 'Y-m-d');
}

function stdDate(string $strDate = ''): string
{
	$strDate = $strDate ?: date('Y-m-d');
	return getFormatedDate('Y-m-d', $strDate, \DateTimeInterface::ATOM);
}

if (!function_exists('updateMailConfig')) {
	function updateMailConfig($setting)
	{
		Config::set('mail.mailers.smtp.host', $setting['host']);
		Config::set('mail.mailers.smtp.port', $setting['port']);
		Config::set('mail.mailers.smtp.encryption', $setting['encryption']);
		Config::set('mail.mailers.smtp.username', $setting['username']);
		Config::set('mail.mailers.smtp.password', $setting['password']);
	}
}

if (!function_exists('splitString')) {
	function splitString($string, $length)
	{
		$words = explode(' ', $string);

		$maxLineLength = $length;

		$currentLength = 0;
		$index = 0;
		$output = array();

		foreach ($words as $word) {
			// +1 because the word will receive back the space in the end that it loses in explode()
			$wordLength = strlen($word) + 1;

			if (($currentLength + $wordLength) <= $maxLineLength) {

				if (isset($output[$index]))
					$output[$index] .= $word . ' ';
				else
					$output[$index] = $word . ' ';
				$currentLength += $wordLength;
			} else {
				$index += 1;
				$currentLength = $wordLength;
				$output[$index] = $word . ' ';
			}
		}

		return $output;
	}
}


function validateRequest(array $request, array $rules)
{
	$validator = Validator::make($request, $rules);

	if ($validator->fails()) {
		// return response()->json([
		// 	'success' => false,
		// 	'errors' => $validator->errors()->all(),
		// 	'first_error' => $validator->errors()->first(),
		// ], 422);
		return $validator->errors()->first();
	}

	return [];
}
