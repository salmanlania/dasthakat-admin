<?php
@session_start();
header('Content-Type: application/json');

// Enforce tools session auth (1-hour rolling)
$ttl = 3600;
$now = time();
if (empty($_SESSION['tools_admin_authed']) || empty($_SESSION['tools_admin_expires_at']) || $_SESSION['tools_admin_expires_at'] <= $now) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}
$_SESSION['tools_admin_expires_at'] = $now + $ttl;

$API_PATH = realpath(__DIR__ . '/../api');
if ($API_PATH === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'API directory not found']);
    exit;
}

// Change to API directory for artisan commands (some actions may rely on paths)
chdir($API_PATH);

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

function db_is_connected($apiDir) {
    $env = parse_env($apiDir);
    $driver = strtolower($env['DB_CONNECTION'] ?? 'mysql');
    if (!in_array($driver, ['mysql', 'mariadb'], true)) return false;
    $host = $env['DB_HOST'] ?? '127.0.0.1';
    $port = (int)($env['DB_PORT'] ?? 3306);
    $user = $env['DB_USERNAME'] ?? '';
    $pass = $env['DB_PASSWORD'] ?? '';
    $db = $env['DB_DATABASE'] ?? '';
    if ($db === '') return false;
    mysqli_report(MYSQLI_REPORT_OFF);
    $mysqli = @mysqli_init();
    if (!$mysqli) return false;
    @$mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 3);
    $ok = @$mysqli->real_connect($host, $user, $pass, $db, $port);
    if ($ok) { @$mysqli->close(); return true; }
    return false;
}

if (!db_is_connected($API_PATH)) {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'Database not connected']);
    exit;
}

$root = realpath(__DIR__ . '/..');
$workflowsDir = $root . DIRECTORY_SEPARATOR . '.github' . DIRECTORY_SEPARATOR . 'workflows';

if (!is_dir($workflowsDir)) {
    // Attempt to create directory tree if missing
    @mkdir($workflowsDir, 0777, true);
}

function ensure_within_dir($base, $target) {
    $realBase = realpath($base);
    $realTarget = realpath($target);
    if ($realTarget === false) return false;
    return strpos($realTarget, $realBase) === 0;
}

function is_yaml($file) {
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    return in_array($ext, ['yml', 'yaml'], true);
}

$action = $_GET['action'] ?? ($_POST['action'] ?? '');

switch ($action) {
    case 'list':
        $items = [];
        if (is_dir($workflowsDir)) {
            foreach (scandir($workflowsDir) as $f) {
                if ($f === '.' || $f === '..') continue;
                if (!is_yaml($f)) continue;
                $p = $workflowsDir . DIRECTORY_SEPARATOR . $f;
                if (is_file($p)) {
                    $items[] = [
                        'name' => $f,
                        'size' => filesize($p),
                        'mtime' => filemtime($p),
                    ];
                }
            }
        }
        echo json_encode(['success' => true, 'files' => $items]);
        break;

    case 'read':
        $file = $_GET['file'] ?? '';
        if ($file === '' || !is_yaml($file)) {
            echo json_encode(['success' => false, 'error' => 'Invalid file']);
            break;
        }
        $path = $workflowsDir . DIRECTORY_SEPARATOR . basename($file);
        if (!is_file($path) || !ensure_within_dir($workflowsDir, $path)) {
            echo json_encode(['success' => false, 'error' => 'File not found']);
            break;
        }
        $content = @file_get_contents($path);
        if ($content === false) {
            echo json_encode(['success' => false, 'error' => 'Failed to read file']);
            break;
        }
        echo json_encode(['success' => true, 'file' => basename($file), 'content' => $content]);
        break;

    case 'save':
        $file = $_POST['file'] ?? '';
        $content = $_POST['content'] ?? '';
        if ($file === '' || !is_yaml($file)) {
            echo json_encode(['success' => false, 'error' => 'Invalid file']);
            break;
        }
        $path = $workflowsDir . DIRECTORY_SEPARATOR . basename($file);
        if (!ensure_within_dir($workflowsDir, $path)) {
            echo json_encode(['success' => false, 'error' => 'Invalid path']);
            break;
        }
        if (@file_put_contents($path, $content) === false) {
            echo json_encode(['success' => false, 'error' => 'Failed to write file']);
            break;
        }
        echo json_encode(['success' => true]);
        break;

    case 'create':
        $file = $_POST['file'] ?? '';
        $content = $_POST['content'] ?? '';
        if ($file === '' || !is_yaml($file)) {
            echo json_encode(['success' => false, 'error' => 'Invalid file name. Use .yml or .yaml']);
            break;
        }
        $file = basename($file); // prevent path traversal
        $path = $workflowsDir . DIRECTORY_SEPARATOR . $file;
        if (file_exists($path)) {
            echo json_encode(['success' => false, 'error' => 'File already exists']);
            break;
        }
        if (!is_dir($workflowsDir) && !@mkdir($workflowsDir, 0777, true)) {
            echo json_encode(['success' => false, 'error' => 'Failed to create workflows directory']);
            break;
        }
        if (@file_put_contents($path, $content) === false) {
            echo json_encode(['success' => false, 'error' => 'Failed to create file']);
            break;
        }
        echo json_encode(['success' => true]);
        break;

    case 'delete':
        $file = $_POST['file'] ?? '';
        if ($file === '' || !is_yaml($file)) {
            echo json_encode(['success' => false, 'error' => 'Invalid file']);
            break;
        }
        $file = basename($file);
        $path = $workflowsDir . DIRECTORY_SEPARATOR . $file;
        if (!file_exists($path) || !is_file($path)) {
            echo json_encode(['success' => false, 'error' => 'File not found']);
            break;
        }
        if (!ensure_within_dir($workflowsDir, $path)) {
            echo json_encode(['success' => false, 'error' => 'Invalid path']);
            break;
        }
        if (!@unlink($path)) {
            echo json_encode(['success' => false, 'error' => 'Failed to delete file']);
            break;
        }
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}
