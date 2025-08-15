<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Tools session auth (1-hour rolling expiry)
@session_start();
$__TTL__ = 3600; // seconds
$__now__ = time();
if (empty($_SESSION['tools_admin_authed']) || empty($_SESSION['tools_admin_expires_at']) || $_SESSION['tools_admin_expires_at'] <= $__now__) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}
// Refresh rolling expiry
$_SESSION['tools_admin_expires_at'] = $__now__ + $__TTL__;

$API_PATH = dirname(__DIR__) . '/api';

function parse_env($path)
{
    $env = [];
    $file = $path . '/.env';
    if (!is_file($file)) return $env;
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        $pos = strpos($line, '=');
        if ($pos === false) continue;
        $key = trim(substr($line, 0, $pos));
        $val = trim(substr($line, $pos + 1));
        $val = trim($val, "\"' ");
        $env[$key] = $val;
    }
    return $env;
}

function db_exists_mysql($env)
{
    $host = $env['DB_HOST'] ?? '127.0.0.1';
    $port = (int)($env['DB_PORT'] ?? 3306);
    $user = $env['DB_USERNAME'] ?? '';
    $pass = $env['DB_PASSWORD'] ?? '';
    $db   = $env['DB_DATABASE'] ?? '';
    if ($db === '') return false;
    // Attempt a direct connection to the specific database
    mysqli_report(MYSQLI_REPORT_OFF);
    $mysqli = @mysqli_init();
    if (!$mysqli) return false;
    @$mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 3);
    $ok = @$mysqli->real_connect($host, $user, $pass, $db, $port);
    if ($ok) { @$mysqli->close(); return true; }
    return false;
}

try {
    $env = parse_env($API_PATH);
    $driver = strtolower($env['DB_CONNECTION'] ?? 'mysql');
    $connected = false;
    if ($driver === 'mysql' || $driver === 'mariadb') {
        $connected = db_exists_mysql($env);
    } else {
        // For other drivers, default to false for now (can be extended)
        $connected = false;
    }
    echo json_encode(['connected' => $connected]);
} catch (Exception $e) {
    echo json_encode(['connected' => false, 'error' => $e->getMessage()]);
}
