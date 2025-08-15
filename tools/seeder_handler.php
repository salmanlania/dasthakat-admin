<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

// Configuration
$API_PATH = realpath(__DIR__ . '/../api');
$SEEDERS_PATH = $API_PATH . '/database/seeders';

// Change to API directory for artisan commands
chdir($API_PATH);

function runCommand($command) {
    $output = [];
    $returnVar = 0;
    exec($command . ' 2>&1', $output, $returnVar);
    return [
        'success' => $returnVar === 0,
        'output' => implode("\n", $output),
        'return_code' => $returnVar
    ];
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

if (!db_is_connected($API_PATH)) {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'Database not connected']);
    exit;
}

function getSeedersList() {
    $seeders = [];
    
    if (is_dir($GLOBALS['SEEDERS_PATH'])) {
        $files = scandir($GLOBALS['SEEDERS_PATH']);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'php' && $file !== '.' && $file !== '..' && $file !== 'DatabaseSeeder.php') {
                $className = pathinfo($file, PATHINFO_FILENAME);
                $name = str_replace(['Seeder', '_'], ['', ' '], $className);
                $name = ucwords(trim($name));
                
                $seeders[] = [
                    'file' => $file,
                    'class' => $className,
                    'name' => $name,
                    'description' => 'Seeds ' . strtolower($name) . ' data'
                ];
            }
        }
    }
    
    // Sort seeders alphabetically
    usort($seeders, function($a, $b) {
        return strcmp($a['name'], $b['name']);
    });
    
    return $seeders;
}

function runSingleSeeder($seederClass) {
    // Validate seeder class
    if (empty($seederClass)) {
        return [
            'success' => false,
            'error' => 'Seeder class not specified'
        ];
    }
    
    // Check if seeder file exists
    $seederFile = $GLOBALS['SEEDERS_PATH'] . '/' . $seederClass . '.php';
    if (!file_exists($seederFile)) {
        return [
            'success' => false,
            'error' => 'Seeder file not found: ' . $seederClass . '.php'
        ];
    }
    
    // Run specific seeder
    $result = runCommand("php artisan db:seed --class={$seederClass}");
    
    return [
        'success' => $result['success'],
        'output' => $result['output'],
        'error' => $result['success'] ? null : $result['output']
    ];
}

function runAllSeeders() {
    // Run all seeders via DatabaseSeeder
    $result = runCommand('php artisan db:seed');
    
    return [
        'success' => $result['success'],
        'output' => $result['output'],
        'error' => $result['success'] ? null : $result['output']
    ];
}

function freshSeed() {
    // Run migrate:fresh --seed
    $result = runCommand('php artisan migrate:fresh --seed');
    
    return [
        'success' => $result['success'],
        'output' => $result['output'],
        'error' => $result['success'] ? null : $result['output']
    ];
}

// Handle requests
try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $action = $_GET['action'] ?? '';
        
        switch ($action) {
            case '': // default to list for simple GET
            case 'list':
                $seeders = getSeedersList();
                echo json_encode(['seeders' => $seeders]);
                break;
            case 'count':
                $seeders = getSeedersList();
                echo json_encode(['count' => count($seeders)]);
                break;
            case 'view':
                $file = $_GET['file'] ?? '';
                if (empty($file)) {
                    echo json_encode(['success' => false, 'error' => 'File not specified']);
                    break;
                }
                $base = realpath($GLOBALS['SEEDERS_PATH']);
                $target = realpath($GLOBALS['SEEDERS_PATH'] . '/' . $file);
                if ($target === false || strpos($target, $base) !== 0 || !is_file($target)) {
                    echo json_encode(['success' => false, 'error' => 'Invalid seeder file']);
                    break;
                }
                $code = file_get_contents($target);
                echo json_encode(['success' => true, 'file' => $file, 'code' => $code]);
                break;
                
            default:
                // Fallback to list for unknown or missing action to be lenient
                $seeders = getSeedersList();
                echo json_encode(['seeders' => $seeders]);
                break;
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'run':
                $seeder = $input['seeder'] ?? '';
                if (empty($seeder)) {
                    echo json_encode(['success' => false, 'error' => 'Seeder class not specified']);
                    break;
                }
                
                $result = runSingleSeeder($seeder);
                echo json_encode($result);
                break;
                
            case 'run_all':
                $result = runAllSeeders();
                echo json_encode($result);
                break;
                
            case 'fresh_seed':
                $result = freshSeed();
                echo json_encode($result);
                break;
                
            default:
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
    } else {
        echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
