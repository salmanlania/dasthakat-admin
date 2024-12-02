<?php
use Illuminate\Support\Facades\Config;
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


 function isPermission($type,$module,$permission)
 {
	$_return = $permission[$module][$type] ?? "";
	if(empty($_return))
             return false;
	return true;
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
	function splitString($string,$length) {
	    $words = explode(' ', $string);

	    $maxLineLength = $length;

	    $currentLength = 0;
	    $index = 0;
	    $output = array();

	    foreach ($words as $word) {
	        // +1 because the word will receive back the space in the end that it loses in explode()
	        $wordLength = strlen($word) + 1;

	        if (($currentLength + $wordLength) <= $maxLineLength) {
		
		   if(isset($output[$index]))
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

?>