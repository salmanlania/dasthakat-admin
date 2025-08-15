<?php
@session_start();
header('Content-Type: application/json');

// Enforce tools session auth (same scheme as index.php)
$ttl = 3600; // keep in sync with index gate (1 hour)
$now = time();
if (empty($_SESSION['tools_admin_authed']) || empty($_SESSION['tools_admin_expires_at']) || $_SESSION['tools_admin_expires_at'] <= $now) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}
// Refresh rolling expiry
$_SESSION['tools_admin_expires_at'] = $now + $ttl;

$action = $_GET['action'] ?? '';

$apiDir = realpath(__DIR__ . '/../api');
if ($apiDir === false) {
    echo json_encode(['success' => false, 'error' => 'API directory not found']);
    exit;
}

// DB existence check via direct MySQL connection using .env
function parse_env($apiDir) {
    $env = [];
    $file = $apiDir . DIRECTORY_SEPARATOR . '.env';
    if (!is_file($file)) return $env;
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(ltrim($line), '#') === 0) continue;
        $pos = strpos($line, '=');
        if ($pos === false) continue;
        $k = trim(substr($line, 0, $pos));
        $v = trim(substr($line, $pos + 1));
        $v = trim($v, "\"' ");
        $env[$k] = $v;
    }
    return $env;
}
function db_is_connected($apiDir)
{
    $env = parse_env($apiDir);
    $driver = strtolower($env['DB_CONNECTION'] ?? 'mysql');
    if (!in_array($driver, ['mysql','mariadb'], true)) return false;
    $host = $env['DB_HOST'] ?? '127.0.0.1';
    $port = (int)($env['DB_PORT'] ?? 3306);
    $user = $env['DB_USERNAME'] ?? '';
    $pass = $env['DB_PASSWORD'] ?? '';
    $db   = $env['DB_DATABASE'] ?? '';
    if ($db === '') return false;
    mysqli_report(MYSQLI_REPORT_OFF);
    $mysqli = @mysqli_init();
    if (!$mysqli) return false;
    @$mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 3);
    $ok = @$mysqli->real_connect($host, $user, $pass, $db, $port);
    if ($ok) { @$mysqli->close(); return true; }
    return false;
}

if (!db_is_connected($apiDir)) {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'Database not connected']);
    exit;
}

function run_cmd($cmd, $cwd)
{
    $descriptorSpec = [
        1 => ['pipe', 'w'], // stdout
        2 => ['pipe', 'w'], // stderr
    ];
    $process = proc_open($cmd, $descriptorSpec, $pipes, $cwd, null);
    if (!is_resource($process)) {
        return [false, ["Failed to start process: $cmd"]];
    }
    $output = [];
    $out = stream_get_contents($pipes[1]);
    $err = stream_get_contents($pipes[2]);
    if (is_resource($pipes[1])) fclose($pipes[1]);
    if (is_resource($pipes[2])) fclose($pipes[2]);
    $exitCode = proc_close($process);
    if ($out !== '') $output = array_merge($output, preg_split("/(\r\n|\n|\r)/", $out));
    if ($err !== '') $output = array_merge($output, preg_split("/(\r\n|\n|\r)/", $err));
    return [$exitCode === 0, $output];
}

function find_composer_command()
{
    // Try plain composer first (assumes in PATH)
    $candidates = [
        'composer',
        'composer.phar',
    ];
    // On Windows with PHP, running via "php composer.phar" might be needed
    foreach ($candidates as $c) {
        return $c; // we'll rely on shell to resolve when possible
    }
}

switch ($action) {
    case 'status':
        // Detect composer version and files presence
        $composerCmd = find_composer_command();
        [$ok, $out] = run_cmd("$composerCmd --version", $apiDir);
        $vendorPresent = is_dir($apiDir . DIRECTORY_SEPARATOR . 'vendor');
        $lockPresent = is_file($apiDir . DIRECTORY_SEPARATOR . 'composer.lock');
        echo json_encode([
            'success' => true,
            'composer_version' => $ok ? trim(implode("\n", $out)) : null,
            'vendor_present' => $vendorPresent,
            'lock_present' => $lockPresent,
        ]);
        break;

    case 'install':
        $composerCmd = find_composer_command();
        // Prefer dist, no interaction, with ansi for better readability
        [$ok, $out] = run_cmd("$composerCmd install --no-interaction --prefer-dist", $apiDir);
        echo json_encode([
            'success' => $ok,
            'output' => $out,
            'error' => $ok ? null : 'Composer install failed'
        ]);
        break;

    case 'dump':
        $composerCmd = find_composer_command();
        [$ok, $out] = run_cmd("$composerCmd dump-autoload -o", $apiDir);
        echo json_encode([
            'success' => $ok,
            'output' => $out,
            'error' => $ok ? null : 'Composer dump-autoload failed'
        ]);
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}
