<?php
// Auth: Validate X-DEPLOY-TOKEN header against APP_KEY in ../api/.env
$headerToken = $_SERVER['HTTP_X_DEPLOY_TOKEN'] ?? null;

// If header missing, reject
if (!$headerToken) {
    http_response_code(401);
    exit('Unauthorized');
}

// Resolve .env path relative to this file
$envPath = __DIR__ . '/../api/.env';
$appKey = null;

if (is_readable($envPath)) {
    $envLines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($envLines as $line) {
        // Skip comments
        if (preg_match('/^\s*#/', $line)) {
            continue;
        }
        if (preg_match('/^\s*APP_KEY\s*=\s*(.*)\s*$/', $line, $m)) {
            $val = trim($m[1]);
            // Strip surrounding quotes if present
            $val = trim($val, "\"' ");
            $appKey = $val;
            break;
        }
    }
}

// Compare tokens; use constant-time comparison when possible
if (!$appKey || !function_exists('hash_equals') ? ($headerToken !== $appKey) : !hash_equals($appKey, $headerToken)) {
    http_response_code(401);
    exit('Unauthorized');
}

$zip_file = '../api/vendor.zip';
$extract_to = '../api';


if (file_exists($zip_file)) {
    $zip = new ZipArchive;
    if ($zip->open($zip_file) === TRUE) {
        echo "Current working directory: " . getcwd() . "<br>";


        if (!file_exists($extract_to)) {
            echo "Creating directory: $extract_to <br>";
            if (mkdir($extract_to, 0777, true)) {
                echo "Directory created successfully.<br>";
            } else {
                echo "Failed to create directory.<br>";
            }
        }

        $zip->extractTo($extract_to);
        $zip->close();

        echo 'Unzip successful!';

        unlink($zip_file);
    } else {
        echo 'Failed to open zip file!';
    }
} else {
    echo 'Zip file not found!';
}
