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
$MIGRATIONS_PATH = $API_PATH . '/database/migrations';

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

function getMigrationStatus() {
    // Get list of all migration files
    $migrationFiles = [];
    if (is_dir($GLOBALS['MIGRATIONS_PATH'])) {
        $files = scandir($GLOBALS['MIGRATIONS_PATH']);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'php' && $file !== '.' && $file !== '..') {
                $migrationFiles[] = $file;
            }
        }
    }
    
    // Get migration status from artisan
    $result = runCommand('php artisan migrate:status');
    $ranMigrations = [];
    
    if ($result['success']) {
        // Parse the output to get ran migrations
        $lines = explode("\n", $result['output']);
        foreach ($lines as $line) {
            $line = trim($line);
            // Look for lines that contain migration names with "Ran" status
            // Format is usually: | Ran | 2025_02_21_124006_create_agents_table |
            if (preg_match('/\|\s*Ran\s*\|\s*(\d{4}_\d{2}_\d{2}_\d{6}_[^\|]+)\s*\|/', $line, $matches)) {
                $migrationName = trim($matches[1]);
                $ranMigrations[] = $migrationName . '.php';
            }
            // Alternative format check for different Laravel versions
            elseif (strpos($line, 'Ran') !== false && preg_match('/(\d{4}_\d{2}_\d{2}_\d{6}_[^\s]+)/', $line, $matches)) {
                $migrationName = trim($matches[1]);
                if (!str_ends_with($migrationName, '.php')) {
                    $migrationName .= '.php';
                }
                $ranMigrations[] = $migrationName;
            }
        }
    }
    
    $migrations = [];
    $ranCount = 0;
    $pendingCount = 0;
    
    foreach ($migrationFiles as $file) {
        $isRan = in_array($file, $ranMigrations);
        $name = str_replace(['_', '.php'], [' ', ''], $file);
        $name = ucwords($name);
        
        $migrations[] = [
            'file' => $file,
            'name' => $name,
            'status' => $isRan ? 'ran' : 'pending'
        ];
        
        if ($isRan) {
            $ranCount++;
        } else {
            $pendingCount++;
        }
    }
    
    // Sort migrations by filename (chronological order)
    usort($migrations, function($a, $b) {
        return strcmp($a['file'], $b['file']);
    });
    
    return [
        'migrations' => $migrations,
        'ran' => $ranCount,
        'pending' => $pendingCount,
        'total' => count($migrations)
    ];
}

function runSingleMigration($migrationFile) {
    // Validate migration file exists
    if (!file_exists($GLOBALS['MIGRATIONS_PATH'] . '/' . $migrationFile)) {
        return [
            'success' => false,
            'error' => 'Migration file not found'
        ];
    }
    
    // Extract migration name without extension
    $migrationName = pathinfo($migrationFile, PATHINFO_FILENAME);
    
    // Run specific migration
    $result = runCommand("php artisan migrate --path=database/migrations/{$migrationFile}");
    
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
                $status = getMigrationStatus();
                echo json_encode($status);
                break;
            case 'stats':
                $status = getMigrationStatus();
                echo json_encode([
                    'ran' => $status['ran'] ?? 0,
                    'pending' => $status['pending'] ?? 0,
                    'total' => $status['total'] ?? 0
                ]);
                break;
            case 'view':
                $file = $_GET['file'] ?? '';
                if (empty($file)) {
                    echo json_encode(['success' => false, 'error' => 'File not specified']);
                    break;
                }
                $base = realpath($GLOBALS['MIGRATIONS_PATH']);
                $target = realpath($GLOBALS['MIGRATIONS_PATH'] . '/' . $file);
                if ($target === false || strpos($target, $base) !== 0 || !is_file($target)) {
                    echo json_encode(['success' => false, 'error' => 'Invalid migration file']);
                    break;
                }
                $code = file_get_contents($target);
                echo json_encode(['success' => true, 'file' => $file, 'code' => $code]);
                break;
                
            default:
                // Fallback to list for unknown or missing action to be lenient
                $status = getMigrationStatus();
                echo json_encode($status);
                break;
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'run':
                $migration = $input['migration'] ?? '';
                if (empty($migration)) {
                    echo json_encode(['success' => false, 'error' => 'Migration file not specified']);
                    break;
                }
                
                $result = runSingleMigration($migration);
                echo json_encode($result);
                break;
                
            case 'run_all':
                $result = runCommand('php artisan migrate');
                echo json_encode([
                    'success' => $result['success'],
                    'output' => $result['output'],
                    'error' => $result['success'] ? null : $result['output']
                ]);
                break;
                
            case 'rollback':
                $result = runCommand('php artisan migrate:rollback');
                echo json_encode([
                    'success' => $result['success'],
                    'output' => $result['output'],
                    'error' => $result['success'] ? null : $result['output']
                ]);
                break;
                
            case 'reset':
                $result = runCommand('php artisan migrate:reset');
                echo json_encode([
                    'success' => $result['success'],
                    'output' => $result['output'],
                    'error' => $result['success'] ? null : $result['output']
                ]);
                break;
                
            case 'fresh':
                $result = runCommand('php artisan migrate:fresh');
                echo json_encode([
                    'success' => $result['success'],
                    'output' => $result['output'],
                    'error' => $result['success'] ? null : $result['output']
                ]);
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
