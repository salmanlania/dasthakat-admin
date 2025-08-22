<?php
// Simple APP_KEY gate for Tools dashboard
// Note: For stronger security, layer with IP allowlist/BasicAuth/2FA.
@session_start();

function tools_env_app_key()
{
    $envPath = realpath(__DIR__ . '/../api/.env');
    if ($envPath === false || !is_file($envPath)) return null;
    $contents = @file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($contents === false) return null;
    foreach ($contents as $line) {
        if (strpos($line, 'APP_KEY=') === 0) {
            return trim(substr($line, strlen('APP_KEY=')));
        }
    }
    return null;
}

// Constant-time compare
function tools_hash_equals($a, $b)
{
    if (!is_string($a) || !is_string($b)) return false;
    if (function_exists('hash_equals')) return hash_equals($a, $b);
    if (strlen($a) !== strlen($b)) return false;
    $res = 0;
    for ($i = 0, $len = strlen($a); $i < $len; $i++) $res |= ord($a[$i]) ^ ord($b[$i]);
    return $res === 0;
}

// 1-hour rolling session expiry
$__TOOLS_SESSION_TTL__ = 3600; // seconds
$now = time();
if (!empty($_SESSION['tools_admin_authed'])) {
    $exp = isset($_SESSION['tools_admin_expires_at']) ? (int)$_SESSION['tools_admin_expires_at'] : 0;
    if ($exp <= $now) {
        // Expired: clear and force re-auth
        $_SESSION = [];
        if (session_id()) {
            @session_destroy();
        }
        // Restart a fresh session array for showing error message
        @session_start();
        $login_error = 'Session expired. Please re-authenticate.';
    } else {
        // Refresh rolling expiry
        $_SESSION['tools_admin_expires_at'] = $now + $__TOOLS_SESSION_TTL__;
    }
}

// Handle logout POST
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['tools_logout'])) {
    $_SESSION = [];
    if (session_id()) {
        @session_destroy();
    }
    // Redirect to same URI to render login gate
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

// Handle login POST
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['tools_key'])) {
    $input = trim((string)($_POST['tools_key'] ?? ''));
    $appKey = tools_env_app_key();
    if ($appKey !== null && tools_hash_equals($input, $appKey)) {
        $_SESSION['tools_admin_authed'] = true;
        $_SESSION['tools_admin_expires_at'] = time() + $__TOOLS_SESSION_TTL__;
        // Redirect to avoid form resubmission
        header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
        exit;
    } else {
        $_SESSION['tools_admin_authed'] = false;
        $login_error = 'Incorrect key';
    }
}

if (empty($_SESSION['tools_admin_authed'])) {
    // Render minimal login gate
?>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tools Login</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
                background: #f3f4f6;
                margin: 0;
            }

            .wrap {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
            }

            .form {
                background: #fff;
                width: 100%;
                max-width: 380px;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                padding: 24px;
                display: flex;
                flex-direction: column;
                justify-content: center;

            }

            .title {
                font-weight: 600;
                font-size: 18px;
                margin: 0 0 8px;
            }

            .sub {
                color: #6b7280;
                font-size: 13px;
                margin: 0 0 16px;
            }

            .field {

                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                font-size: 14px;
                outline: none;
            }

            .btn {
                width: 100%;
                background: #0d9488;
                color: #fff;
                border: none;
                border-radius: 10px;
                padding: 10px 12px;
                font-weight: 600;
                cursor: pointer;
            }

            .btn:hover {
                filter: brightness(0.95);
            }

            .err {
                color: #dc2626;
                font-size: 12px;
                margin-top: 8px;
            }
        </style>
    </head>

    <body>
        <div class="wrap">
            <form class="form" method="post" autocomplete="off">
                <h1 class="title">Admin Verification</h1>
                <p class="sub">Enter the application key to access the tools.</p>
                <input class="field " type="password" name="tools_key" placeholder="APP key" required />
                <div style="height:12px"></div>
                <button class="btn" type="submit">Authenticate</button>
                <?php if (!empty($login_error)) {
                    echo '<div class="err">' . htmlspecialchars($login_error) . '</div>';
                } ?>
            </form>
        </div>


    </body>

    </html>
<?php
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Toolkit - Minimal Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@rive-app/canvas@2.14.0"></script>
    <style>
        /* shadcn-like tokens */
        :root {
            /* base palette (light) */
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;

            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;

            --popover: 0 0% 100%;
            --popover-foreground: 222.2 84% 4.9%;

            --primary: 221.2 83.2% 53.3%;
            /* ~#3b82f6 */
            --primary-foreground: 210 40% 98%;

            --secondary: 210 40% 96.1%;
            --secondary-foreground: 222.2 47.4% 11.2%;

            --muted: 210 40% 96.1%;
            --muted-foreground: 215.4 16.3% 46.9%;

            --accent: 210 40% 96.1%;
            --accent-foreground: 222.2 47.4% 11.2%;

            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;

            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --ring: 221.2 83.2% 53.3%;

            --radius: 0.5rem;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --background: 224 71% 4%;
                --foreground: 213 31% 91%;

                --card: 224 71% 4%;
                --card-foreground: 213 31% 91%;

                --popover: 224 71% 4%;
                --popover-foreground: 213 31% 91%;

                --primary: 217.2 91.2% 59.8%;
                --primary-foreground: 222.2 47.4% 11.2%;

                --secondary: 215 27.9% 16.9%;
                --secondary-foreground: 210 40% 98%;

                --muted: 215 27.9% 16.9%;
                --muted-foreground: 217.9 10.6% 64.9%;

                --accent: 215 27.9% 16.9%;
                --accent-foreground: 210 40% 98%;

                --destructive: 0 62.8% 30.6%;
                --destructive-foreground: 210 40% 98%;

                --border: 215 27.9% 16.9%;
                --input: 215 27.9% 16.9%;
                --ring: 217.2 91.2% 59.8%;
            }
        }

        html {
            color-scheme: light;
        }

        body {
            font-family: 'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Inter, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            min-height: 100vh;
        }

        /* Sidebar: fixed + collapsible */
        :root {
            --sidebar-w: 280px;
            --sidebar-w-collapsed: 72px;
            --sidebar-bg: #E3F4E9;
        }

        /* track and bar base */
        .indeterminate-track {
            position: relative;
            overflow: hidden;
        }

        .indeterminate-bar {
            position: relative;
            display: block;
            height: 4px;
            width: 40%;
            background: #0d9488;
            border-radius: 9999px;
            animation: indeterminate 1.2s ease-in-out infinite;
        }

        /* looping slide animation */
        @keyframes indeterminate {
            0% {
                transform: translateX(-100%);
            }

            50% {
                transform: translateX(40%);
            }

            100% {
                transform: translateX(150%);
            }
        }

        .sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: var(--sidebar-w);
            transition: width 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
            /* border-right: 1px solid hsl(var(--border)); */
            /* glassy feel: translucent overlay over base color */
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.55)), var(--sidebar-bg);
            backdrop-filter: saturate(140%) blur(8px);
            overflow: hidden;
            z-index: 40;
            /* blob motion default duration */
            --blob-trans: 10s;
        }

        /* ensure content sits above decorative layers */
        .sidebar>* {
            position: relative;
            z-index: 1;
        }

        /* glassy meshy blobs */
        .sidebar::before,
        .sidebar::after {
            content: "";
            position: absolute;
            width: 320px;
            height: 320px;
            border-radius: 9999px;
            filter: blur(40px);
            opacity: 0.55;
            pointer-events: none;
            z-index: 0;
            mix-blend-mode: multiply;
            will-change: transform;
        }

        /* top-left blob (teal/green) */
        .sidebar::before {
            top: -80px;
            left: -80px;
            background: radial-gradient(closest-side, rgba(16, 185, 129, 0.65), rgba(16, 185, 129, 0.0) 70%);
            transform: translate(var(--blob-a-x, 0px), var(--blob-a-y, 0px)) scale(var(--blob-a-s, 1));
            transition: transform var(--blob-trans) ease-in-out;
        }

        /* bottom-right blob (indigo/blue) */
        .sidebar::after {
            bottom: -100px;
            right: -100px;
            background: radial-gradient(closest-side, rgba(99, 102, 241, 0.6), rgba(99, 102, 241, 0.0) 70%);
            transform: translate(var(--blob-b-x, 0px), var(--blob-b-y, 0px)) scale(var(--blob-b-s, 1));
            transition: transform var(--blob-trans) ease-in-out;
        }

        /* On hover: energize blob motion with faster transition */
        .sidebar:hover {
            --blob-trans: 6s;
        }

        @keyframes float-a {
            0% {
                transform: translate(0, 0) scale(1);
            }

            25% {
                transform: translate(20px, -10px) scale(1.05);
            }

            50% {
                transform: translate(0, 15px) scale(0.98);
            }

            75% {
                transform: translate(-15px, -5px) scale(1.03);
            }

            100% {
                transform: translate(0, 0) scale(1);
            }
        }

        @keyframes float-b {
            0% {
                transform: translate(0, 0) scale(1);
            }

            25% {
                transform: translate(-15px, 10px) scale(1.04);
            }

            50% {
                transform: translate(5px, -10px) scale(1.0);
            }

            75% {
                transform: translate(10px, 15px) scale(0.97);
            }

            100% {
                transform: translate(0, 0) scale(1);
            }
        }

        /* accessibility: reduce motion */
        /* @media (prefers-reduced-motion: reduce) {

            .sidebar::before,
            .sidebar::after {
                animation: none;
            }
        } */

        /* push page content so it doesn't sit behind the fixed sidebar */
        body.with-sidebar {
            padding-left: var(--sidebar-w);
        }

        body.with-sidebar.sidebar-collapsed {
            padding-left: var(--sidebar-w-collapsed);
        }

        /* collapse style */
        .sidebar.collapsed {
            width: var(--sidebar-w-collapsed);
        }

        /* Ensure sidebar links don't overflow when collapsed */
        .sidebar a {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Optional: hide any elements marked as link-text on collapse */
        .sidebar .link-text {
            transition: opacity .15s ease, max-width .2s ease;
            display: inline-block;
        }

        body.sidebar-collapsed .sidebar .link-text {
            opacity: 0;
            max-width: 0;
        }

        /* Collapsed link layout (shadcn-like rail) */
        .sidebar .sidebar-link {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .sidebar .sidebar-link i {
            width: 20px;
            text-align: center;
        }

        .sidebar.collapsed .sidebar-link {
            justify-content: center;
            gap: 0;
        }

        .sidebar.collapsed .sidebar-link i {
            margin-right: 0;
        }

        .sidebar.collapsed .sidebar-link .badge,
        .sidebar.collapsed .sidebar-link .chevron {
            display: none;
        }

        /* Collapse utilities: show/hide */
        .collapsed-only {
            display: none;
        }

        .expanded-only {
            display: initial;
        }

        body.sidebar-collapsed .collapsed-only {
            display: flex;
        }

        body.sidebar-collapsed .expanded-only {
            display: none;
        }

        /* Hide any progress visuals inside sidebar when collapsed */
        .sidebar.collapsed .progress,
        .sidebar.collapsed .progress-bar,
        .sidebar.collapsed .progress-line {
            display: none !important;
        }

        /* Toggle button inside sidebar header */
        .sidebar-toggle {
            position: absolute;
            top: 12px;
            right: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            border: 1px solid hsl(var(--border));
            background: hsl(var(--card));
            color: hsl(var(--card-foreground));
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            z-index: 9999 !important;
        }

        /* Center the toggle in collapsed state */
        .sidebar.collapsed .sidebar-toggle {
            left: 50%;
            right: auto;
            transform: translateX(-50%);
        }

        .sidebar-toggle:hover {
            filter: brightness(0.97);
        }

        /* Simplified Sidebar */
        .sidebar-link {
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
        }

        .sidebar-link:hover {
            background-color: #ffffff;
            color: hsl(var(--accent-foreground));
        }

        .sidebar-link.active {
            /* border-left-color: hsl(var(--ring)); */
            background-color: white;
            color: hsl(var(--accent-foreground));
        }

        /* Clean Card Design */
        .card {
            background: hsl(var(--card));
            color: hsl(var(--card-foreground));
            border: 1px solid hsl(var(--border));
            border-radius: var(--radius);
            transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .card:hover {
            border-color: hsl(var(--input));
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        /* Button Styles */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            height: 2rem;
            padding: 0 0.875rem;
            border-radius: calc(var(--radius) - 2px);
            border: 1px solid hsl(var(--border));
            background: hsl(var(--secondary));
            color: hsl(var(--secondary-foreground));
            font-weight: 500;
            transition: background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .06s ease;
        }

        .btn:focus {
            outline: none;
            box-shadow: 0 0 0 3px hsl(var(--ring) / 0.35);
        }

        .btn:active {
            transform: translateY(0.5px);
        }

        .btn-primary {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            border-color: hsl(var(--primary));
        }

        .btn-primary:hover {
            filter: brightness(0.95);
        }

        .btn-secondary {
            background: hsl(var(--secondary));
            color: hsl(var(--secondary-foreground));
        }

        .btn-secondary:hover {
            filter: brightness(0.96);
        }

        .btn-danger {
            background: hsl(var(--destructive));
            color: hsl(var(--destructive-foreground));
            border-color: hsl(var(--destructive));
        }

        .btn-danger:hover {
            filter: brightness(0.95);
        }

        /* Status Indicators */
        .status-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 9999px;
            border: 1px solid hsl(var(--border));
        }

        .status-completed {
            background-color: hsl(var(--secondary));
            color: hsl(var(--secondary-foreground));
        }

        .status-pending {
            background-color: hsl(var(--muted));
            color: hsl(var(--muted-foreground));
        }

        /* Content Transitions */
        .content-section {
            display: none;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .content-section.active {
            display: block;
            opacity: 1;
        }

        /* Loading Spinner */
        .loading-spinner {
            width: 24px;
            height: 24px;
            border: 3px solid rgba(59, 130, 246, 0.1);
            border-left: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .sidebar {
                position: fixed;
                left: -100%;
                top: 0;
                bottom: 0;
                width: var(--sidebar-w);
                transition: left 0.3s ease, background-color 0.2s ease, border-color 0.2s ease;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.55)), var(--sidebar-bg);
                backdrop-filter: saturate(140%) blur(8px);
                overflow: hidden;

            }

            /* open state slides the sidebar into view on mobile */
            .sidebar.open {
                left: 0%;
            }

            /* main content should not be shifted on mobile */
            body.with-sidebar {
                padding-left: 0 !important;
            }

            /* dark overlay behind sidebar on mobile */
            .sidebar-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.42);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.25s ease;
                /* z-index: 999999 !important; */
            }

            body.sidebar-open .sidebar-overlay {
                opacity: 1;
                pointer-events: auto;
            }
        }

        /* Toasts (shadcn-like) */
        .toast-container {
            pointer-events: none;
        }

        .toast {
            pointer-events: auto;
            background: hsl(var(--popover));
            color: hsl(var(--popover-foreground));
            border: 1px solid hsl(var(--border));
            border-radius: calc(var(--radius) - 2px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06);
            transform: translateY(-8px);
            opacity: 0;
            animation: toast-in 280ms cubic-bezier(.2, .7, .3, 1) forwards;
        }

        .toast-leave {
            animation: toast-out 220ms ease forwards;
        }

        .toast-accent-success {
            box-shadow: inset 3px 0 0 0 hsl(150 60% 40% / 0.9);
        }

        .toast-accent-error {
            box-shadow: inset 3px 0 0 0 hsl(0 84% 60% / 0.9);
        }

        .toast-accent-warning {
            box-shadow: inset 3px 0 0 0 hsl(40 92% 50% / 0.9);
        }

        .toast-accent-info {
            box-shadow: inset 3px 0 0 0 hsl(var(--ring));
        }

        @keyframes toast-in {
            from {
                transform: translateY(-8px) scale(.98);
                opacity: 0;
            }

            to {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }

        @keyframes toast-out {
            to {
                transform: translateY(-8px);
                opacity: 0;
            }
        }

        /* Active nav state */
        .sidebar-link.active {
            background: #ffffff;
        }

        /* Dialogs / Modals (shadcn-like) */
        .modal-overlay {
            background: rgba(2, 6, 23, 0.45);
            transition: opacity 200ms ease;
            backdrop-filter: saturate(140%) blur(4px);
        }

        .modal-card {
            background: hsl(var(--card));
            color: hsl(var(--card-foreground));
            border: 1px solid hsl(var(--border));
            border-radius: var(--radius);
            box-shadow: 0 24px 48px rgba(0, 0, 0, 0.14), 0 8px 16px rgba(0, 0, 0, 0.08);
            transform: translateY(6px) scale(.98);
            opacity: 0;
            transition: all 240ms cubic-bezier(.2, .7, .3, 1);
        }

        .modal-open .modal-card {
            transform: translateY(0) scale(1);
            opacity: 1;
        }

        /* Force light tokens regardless of system setting (final override) */
        :root {
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 222.2 84% 4.9%;
            --primary: 221.2 83.2% 53.3%;
            --primary-foreground: 210 40% 98%;
            --secondary: 210 40% 96.1%;
            --secondary-foreground: 222.2 47.4% 11.2%;
            --muted: 210 40% 96.1%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96.1%;
            --accent-foreground: 222.2 47.4% 11.2%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;
            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --ring: 221.2 83.2% 53.3%;
            --radius: 0.5rem;
        }
    </style>
</head>

<body class="flex with-sidebar">
    <button class=" mobile-menu-btn hover:bg-gray-50 cursor-pointer fixed top-4 w-10 h-10 left-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200 md:hidden">
        <i class="fas fa-bars text-gray-600"></i>
    </button>

    <div id="sidebar-overlay" class="sidebar-overlay" aria-hidden="true"></div>
    <div id="sidebar" class="sidebar bg-white h-screen flex-shrink-0">
        <!-- <div class="h-fit flex items-center justify-between transition px-4 py-3 relative"> -->
        <!-- <h1 class="text-lg font-semibold tracking-tight">
                <span class="font-medium text-lg">GMS-America</span>
            </h1> -->
        <!-- Collapsed-only brand icon centered -->
        <!-- <div class="collapsed-only w-full items-center justify-center">
                <i class="fas fa-sliders-h text-indigo-700 text-lg"></i>
            </div>
        </div> -->
        <!-- Mobile dark overlay for off-canvas sidebar -->
        <button id="sidebar-toggle" class="sidebar-toggle cursor-pointer" aria-label="Toggle sidebar">
            <i class="fas fa-bars"></i>
        </button>

        <div class="p-5">
            <h1 class="text-xl font-semibold text-gray-800 flex items-center expanded-only">
                <div class="ml-2 text-[18px]">
                    Project Toolkit
                    <span class="text-xs block text-gray-700 font-normal ">
                        <a href="https://gms.bharmalportal.com" target="_blank"><i class="fas fa-external-link-alt mr-1"></i>GMS-America</a>
                    </span>
                </div>
            </h1>
        </div>


        <nav class="mt-4 px-2">
            <ul class="space-y-1">
                <li>
                    <a href="#" onclick="showSection('dashboard', this, event)" class="sidebar-link flex items-center px-3 py-2 text-gray-700 rounded-md text-sm font-medium">
                        <i class="fas fa-tachometer-alt mr-3 text-gray-500"></i>
                        Dashboard
                    </a>
                </li>
                <li>
                    <a href="#" data-requires-db="true" onclick="showSection('migrations', this, event)" class="sidebar-link flex items-center px-3 py-2 text-gray-700 rounded-md text-sm font-medium">
                        <i class="fas fa-database mr-3 text-gray-500"></i>
                        Migrations
                    </a>
                </li>
                <li>
                    <a href="#" data-requires-db="true" onclick="showSection('seeders', this, event)" class="sidebar-link flex items-center px-3 py-2 text-gray-700 rounded-md text-sm font-medium">
                        <i class="fas fa-seedling mr-3 text-gray-500"></i>
                        Seeders
                    </a>
                </li>
                <li>
                    <a href="#" data-requires-db="true" onclick="showSection('composer', this, event)" class="sidebar-link flex items-center px-3 py-2 text-gray-700 rounded-md text-sm font-medium">
                        <i class="fas fa-box mr-3 text-gray-500"></i>
                        Composer
                    </a>
                </li>
                <li>
                    <a href="#" data-requires-db="true" onclick="if (showSection('workflows', this, event) !== false) { listWorkflows(); }" class="sidebar-link flex items-center px-3 py-2 text-gray-700 rounded-md text-sm font-medium">
                        <i class="fas fa-project-diagram mr-3 text-gray-500"></i>
                        Workflows
                    </a>
                </li>
                <li>
                    <form method="post">
                        <input type="hidden" name="tools_logout" value="1" />
                        <button type="submit" class="w-full sidebar-link flex items-center px-3 py-2 text-gray-700 rounded-md text-sm font-medium">
                            <i class="fas fa-sign-out-alt mr-3 text-gray-500 hover:text-red-600"></i>
                            Logout
                        </button>
                    </form>
                </li>
            </ul>
        </nav>

        <div class="px-2 mt-8 ">
            <div class="expanded-only ">
                <div class="p-2 rounded-lg shadow-sm bg-white">

                    <div class="text-xs font-medium text-gray-800 mb-2">Migration Progress</div>
                    <div class="h-2 bg-gray-200 overflow-hidden" aria-label="Migrations progress bar">
                        <div id="sidebar-migration-progress-bar" class="h-full bg-teal-600" style="width: 0%"></div>
                    </div>
                    <div id="sidebar-migration-progress-text" class="text-xs text-gray-800 mt-1">0% Executed</div>
                </div>
            </div>
        </div>


    </div>

    <div class="flex-1 overflow-auto">
        <div id="dashboard" class="content-section p-4 md:p-6">
            <div class="mb-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-1">
                    Welcome Back
                </h2>
                <p class="text-gray-600">
                    Manage your database migrations and seeders
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="card bg-white p-4 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <i class="fas fa-check text-green-600"></i>
                        </div>
                        <div>
                            <div class="text-lg font-semibold" id="count-migrations-run">0</div>
                            <div class="text-sm text-gray-500">Migrations Run</div>
                        </div>
                    </div>
                </div>
                <div class="card bg-white p-4 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                            <i class="fas fa-clock text-yellow-600"></i>
                        </div>
                        <div>
                            <div class="text-lg font-semibold" id="count-migrations-pending">0</div>
                            <div class="text-sm text-gray-500">Migrations Pending</div>
                        </div>
                    </div>
                </div>
                <div class="card bg-white p-4 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <i class="fas fa-seedling text-blue-600"></i>
                        </div>
                        <div>
                            <div class="text-lg font-semibold" id="count-seeders">0</div>
                            <div class="text-sm text-gray-500">Seeders</div>
                        </div>
                    </div>
                </div>
                <div class="card bg-white p-4 rounded-lg">
                    <div class="flex items-center">
                        <div id="db-status-icon" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <i id="db-status-icon-i" class="fas fa-server text-gray-500"></i>
                        </div>
                        <div>
                            <div id="db-status-text" class="text-lg font-semibold">Checking...</div>
                            <div id="db-status-subtext" class="text-sm text-gray-500">Database</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="card bg-white p-6 rounded-lg">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-database text-blue-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Manage Migrations</h3>
                    <p class="text-gray-600 text-sm mb-4">Control your database schema changes</p>
                    <button data-requires-db="true" onclick="showSection('migrations', this)" class="btn btn-primary w-full py-2 rounded-lg text-sm">
                        Open Migrations
                    </button>
                </div>

                <div class="card bg-white p-6 rounded-lg">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-seedling text-green-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Database Seeders</h3>
                    <p class="text-gray-600 text-sm mb-4">Populate your database with sample data</p>
                    <button data-requires-db="true" onclick="showSection('seeders', this)" class="bg-green-600 text-white w-full py-2 rounded-lg text-sm">
                        Open Seeders
                    </button>
                </div>

                <div class="card bg-white p-6 rounded-lg">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-code-branch text-purple-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Workflows</h3>
                    <p class="text-gray-600 text-sm mb-4">Manage GitHub Actions</p>
                    <button data-requires-db="true" onclick="if (showSection('workflows', this) !== false) { listWorkflows(); }" class="bg-purple-600 text-white w-full py-2 rounded-lg text-sm">
                        Open Workflows
                    </button>
                </div>
            </div>
        </div>

        <div id="migrations" class="content-section p-4 md:p-6">
            <div class="mb-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-1">Database Migrations</h2>
                <p class="text-gray-600">Manage your database schema changes</p>
            </div>

            <!-- Migration Controls -->
            <div class="card bg-white p-4 mb-4 rounded-lg">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 class="text-lg font-semibold mb-1">Migration Control</h3>
                        <p class="text-gray-600 text-sm">Execute and monitor migrations</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button data-requires-db="true" onclick="runAllMigrations()" class="btn btn-secondary px-4 py-2 rounded-lg text-sm">
                            Run All
                        </button>
                        <button data-requires-db="true" onclick="refreshMigrations()" class="btn btn-primary px-4 py-2 rounded-lg text-sm">
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <!-- Migration Status -->
            <div class="card bg-white p-4 mb-4 rounded-lg">
                <h3 class="text-lg font-semibold mb-3 flex items-center">
                    <i class="fas fa-chart-pie mr-2 text-blue-500"></i>
                    Migration Overview
                </h3>
                <div id="migration-status" class="py-4">
                    <div class="loading-spinner mx-auto mb-2"></div>
                    <p class="text-gray-500 text-center text-sm">Loading migration status...</p>
                </div>
            </div>

            <!-- Migrations List -->
            <div class="card bg-white p-1 rounded-lg">
                <h3 class="bg-gray-50 p-2  rounded-md text-sm font-semibold mb-3 flex items-center">
                    <i class="fas fa-list mr-2 text-blue-500"></i>
                    Number of Migrations
                </h3>
                <div id="migrations-list" class="space-y-3 p-4">
                    <!-- Migrations will be loaded here -->
                </div>
            </div>
        </div>

        <div id="seeders" class="content-section p-4 md:p-6">
            <div class="mb-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-1">Database Seeders</h2>
                <p class="text-gray-600">Populate your database with sample data</p>
            </div>

            <!-- Seeder Controls -->
            <div class="card bg-white p-4 mb-4 rounded-lg">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 class="text-lg font-semibold mb-1">Seeder Control</h3>
                        <p class="text-gray-600 text-sm">Execute and manage seeders</p>
                    </div>
                    <button onclick="refreshSeeders()" class="btn btn-primary px-4 py-2 rounded-lg text-sm">
                        Refresh
                    </button>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="card bg-white p-4 rounded-lg">
                    <h4 class="text-md font-semibold mb-2 flex items-center">
                        <i class="fas fa-play mr-2 text-green-500"></i>
                        Run All Seeders
                    </h4>
                    <p class="text-gray-600 text-sm mb-3">Execute all available seeders</p>
                    <button data-requires-db="true" onclick="runAllSeeders()" class="btn btn-secondary w-full py-2 rounded-lg text-sm">
                        Execute All
                    </button>
                </div>

                <!-- <div class="card bg-white p-4 rounded-lg">
                    <h4 class="text-md font-semibold mb-2 flex items-center">
                        <i class="fas fa-refresh mr-2 text-red-500"></i>
                        Fresh Seed
                    </h4>
                    <p class="text-gray-600 text-sm mb-3">Reset database and run fresh seed</p>
                    <button data-requires-db="true" onclick="rollbackSeeders()" class="btn btn-danger w-full py-2 rounded-lg text-sm">
                        Fresh Seed
                    </button>
                </div> -->
            </div>

            <!-- Seeders List -->
            <div class="card bg-white p-4 rounded-lg">
                <h3 class="text-lg font-semibold mb-3 flex items-center">
                    <i class="fas fa-list mr-2 text-green-500"></i>
                    Available Seeders
                </h3>
                <div id="seeders-list" class="space-y-3">
                    <!-- Seeders will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Composer Dependencies -->
        <div id="composer" class="content-section p-4 md:p-6">
            <div class="mb-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-1">Composer Dependencies (api/)</h2>
                <p class="text-gray-600">Install and manage PHP dependencies for the API folder</p>
            </div>

            <div class="card bg-white p-4 mb-4 rounded-lg">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 class="text-lg font-semibold mb-1">Composer Control</h3>
                        <p class="text-gray-600 text-sm">Run composer tasks in the <code>api/</code> directory</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="checkComposerStatus()" class="btn btn-secondary px-4 py-2 rounded-lg text-sm">Check Status</button>
                        <button onclick="installComposerDeps()" class="btn btn-primary px-4 py-2 rounded-lg text-sm">Install Dependencies</button>
                        <button onclick="dumpComposerAutoload()" class="btn px-4 py-2 rounded-lg text-sm" style="background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe;">Dump Autoload</button>
                    </div>
                </div>
            </div>

            <div class="card bg-white p-4 rounded-lg">
                <h3 class="text-md font-semibold mb-2">Output</h3>
                <pre id="composer-output" class="text-xs bg-gray-50 p-3 rounded border border-gray-200 max-h-[50vh] overflow-auto whitespace-pre-wrap">No output yet.</pre>
            </div>
        </div>
        <!-- GitHub Workflows Manager -->
        <div id="workflows" class="content-section p-4 md:p-6 hidden">
            <div class="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-800 mb-1">GitHub Workflows</h2>
                    <p class="text-gray-600">Manage CI/CD files under <code>.github/workflows/</code></p>
                </div>
                <div class="flex gap-2">
                    <!-- <button onclick="createWorkflow()" class="btn btn-primary h-9 px-4 rounded-lg text-sm inline-flex items-center"><i class="fas fa-plus mr-2"></i>New</button> -->
                    <!-- <button onclick="listWorkflows()" class="btn btn-secondary h-9 px-4 rounded-lg text-sm inline-flex items-center"><i class="fas fa-rotate mr-2"></i>Refresh</button> -->
                    <button onclick="createWorkflow()" class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                        Create Workflow
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Files pane -->
                <div class="md:col-span-1">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="px-3 py-2 border-b border-gray-200 text-xs font-medium tracking-wide text-black">Pipeline</div>
                        <div id="wf-list" class="max-h-[60vh] overflow-auto divide-y divide-gray-100">
                            <!-- populated by JS -->
                        </div>
                    </div>
                </div>

                <!-- Editor pane -->
                <div class="md:col-span-2">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Editor</span>
                                <span class="text-[11px] text-gray-800 px-2 py-0.5  rounded-md bg-gray-100" id="wf-current-name">No file selected</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <button onclick="deleteWorkflow()" class="h-8 px-3 rounded-md text-xs inline-flex items-center border border-red-300 text-red-700 hover:bg-red-50" title="Delete current workflow">
                                    <i class="fas fa-trash mr-1"></i>Delete
                                </button>
                                <button onclick="if(window.__wfCurrent){openWorkflow(window.__wfCurrent)}" class="btn btn-secondary h-8 px-3 rounded-md text-xs inline-flex items-center"><i class="fas fa-rotate-left mr-1"></i>Revert</button>
                                <button onclick="saveWorkflow()" class="bg-purple-600 text-white h-8 px-3 rounded-md text-xs inline-flex items-center"><i class="fas fa-save mr-1"></i>Save</button>
                            </div>
                        </div>
                        <!-- Secrets used in current workflow -->
                        <div id="wf-secrets" class="px-3 py-2 border-b border-gray-100 bg-gray-50 text-[11px] text-gray-700 hidden"></div>
                        <div class="p-0">
                            <div id="wf-editor" class="w-full h-[50vh]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="toast-container" class="toast-container overflow-hidden fixed top-4 right-4 z-50 space-y-3 w-80 max-w-[90vw]"></div>

    <div id="loading-modal" class="fixed inset-0 hidden z-40 modal-overlay items-center justify-center">
        <div class="modal-card rounded-2xl p-6 md:p-7 w-[92vw] max-w-sm text-center mx-4 relative overflow-hidden">
            <div class="top-accent" aria-hidden="true"></div>
            <p class="text-gray-800 font-semibold" id="loading-text">Processing...</p>
            <p class="text-gray-500 text-sm mt-1">Please wait a moment</p>
            <div class="indeterminate-track h-1 bg-gray-200 rounded-full mt-4">
                <div class="indeterminate-bar" aria-hidden="true"></div>
            </div>
        </div>
    </div>

    <div id="confirm-modal" class="fixed inset-0 hidden z-40 modal-overlay items-center justify-center">
        <div class="modal-card rounded-2xl p-3 md:p-4 max-w-sm w-full mx-4 text-center">

            <h3 class="text-lg font-semibold ">Confirm Action</h3>
            <p id="confirm-message" class="text-gray-600 text-sm mb-6">
                Are you sure you want to proceed?
            </p>
            <div class="flex justify-end space-x-2">
                <button id="confirm-no" class="w-full py-1 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                <button id="confirm-yes" class="btn btn-primary w-full py-1 text-sm rounded-lg">Confirm</button>
            </div>
        </div>
    </div>

    <!-- Code Viewer Modal (centered, scrollable; only close button) -->
    <div id="code-viewer-modal" class="fixed inset-0 hidden z-40 modal-overlay items-center justify-center">
        <div class="modal-card rounded-2xl p-0 w-[92vw] max-w-3xl mx-4 relative overflow-hidden">
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                <div class="text-sm font-semibold truncate" id="code-viewer-title">File</div>
                <button id="code-viewer-close" class="w-8 h-8 inline-flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="max-h-[70vh] overflow-auto bg-gray-50">
                <pre class="m-0 p-4 text-[12px] leading-5 whitespace-pre-wrap font-mono" id="code-viewer-content"><span class="text-gray-500">Loading...</span></pre>
            </div>
        </div>
    </div>

    <!-- Create Workflow Modal -->
    <div id="wf-create-modal" class="fixed inset-0 hidden z-40 modal-overlay items-center justify-center">
        <div class="modal-card rounded-2xl p-0 w-[92vw] max-w-md mx-4 overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                <div class="text-sm font-semibold">Create Workflow</div>
                <button id="wf-create-close" class="w-8 h-8 inline-flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4 bg-white">
                <label class="block text-sm text-gray-700 mb-1" for="wf-create-name">File name</label>
                <input id="wf-create-name" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="e.g. deploy.yml" />
                <p class="text-[11px] text-gray-500 mt-2">Must end with .yml or .yaml</p>
                <div class="mt-4 grid grid-cols-2 gap-2">
                    <button id="wf-create-cancel" class="w-full py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button id="wf-create-save" class="btn btn-primary w-full py-2 text-sm rounded-lg">Create</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Monaco Editor Loader -->
    <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js"></script>

    <script>
        // Global state
        let sidebarOpen = false;
        let isDbConnected = false;

        // Monaco (VS Code) editor for Workflows
        window.__wfEditor = null;

        function ensureWfEditor(cb) {
            if (window.__wfEditor) {
                cb && cb();
                return;
            }
            if (typeof require === 'undefined') {
                return setTimeout(() => ensureWfEditor(cb), 100);
            }
            require.config({
                paths: {
                    'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
                }
            });
            require(['vs/editor/editor.main'], function() {
                const container = document.getElementById('wf-editor');
                if (!container) {
                    cb && cb();
                    return;
                }
                window.__wfEditor = monaco.editor.create(container, {
                    value: '# Select a workflow to view/edit, or create a new one',
                    language: 'yaml',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    minimap: {
                        enabled: false
                    },
                    fontSize: 13,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false
                });
                // Initial secrets render
                try {
                    wfRenderSecrets(wfParseSecrets(window.__wfEditor.getValue()));
                } catch (_) {}
                // Update secrets on edit
                window.__wfEditor.onDidChangeModelContent(() => {
                    try {
                        const txt = window.__wfEditor.getValue();
                        wfRenderSecrets(wfParseSecrets(txt));
                    } catch (_) {}
                });
                cb && cb();
            });
        }

        // Extract secrets used in YAML content: matches ${{ secrets.NAME }}
        function wfParseSecrets(text) {
            if (!text) return [];
            const re = /\$\{\{\s*secrets\.([A-Za-z0-9_]+)\s*\}\}/g;
            const set = new Set();
            let m;
            while ((m = re.exec(text)) !== null) {
                set.add(m[1]);
            }
            return Array.from(set).sort();
        }

        // Render secrets list in the bar under the editor header
        function wfRenderSecrets(list) {
            const bar = document.getElementById('wf-secrets');
            if (!bar) return;
            if (!list || list.length === 0) {
                bar.classList.add('hidden');
                bar.innerHTML = '';
                return;
            }
            bar.classList.remove('hidden');
            bar.innerHTML = `Secrets used: ` + list.map(n => `<span class="inline-flex items-center px-2 py-0.5 mr-1 mb-1 rounded border border-gray-300 bg-white text-gray-700">${n}</span>`).join('');
        }

        // Utility Functions
        function toggleSidebar() {
            console.log("Sidebar toggle");
            const sidebar = document.getElementById('sidebar');
            sidebarOpen = !sidebarOpen;
            sidebar.classList.toggle('open', sidebarOpen);
        }

        // DB Status helpers
        function updateDbStatusUI(connected, errorText = '') {
            isDbConnected = !!connected;
            const iconWrap = document.getElementById('db-status-icon');
            const icon = document.getElementById('db-status-icon-i');
            const text = document.getElementById('db-status-text');
            const sub = document.getElementById('db-status-subtext');
            if (iconWrap && icon && text) {
                if (isDbConnected) {
                    iconWrap.className = 'w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3';
                    icon.className = 'fas fa-server text-green-600';
                    text.textContent = 'Connected';
                    if (sub) sub.textContent = 'Database';
                } else {
                    iconWrap.className = 'w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3';
                    icon.className = 'fas fa-server text-red-600';
                    text.textContent = 'Disconnected';
                    if (sub) sub.textContent = 'Database';
                }
            }
            // Toggle disabled state on all elements that require DB
            document.querySelectorAll('[data-requires-db]')?.forEach(el => {
                const disable = !isDbConnected;
                try {
                    el.disabled = disable;
                } catch (e) {}
                el.classList.toggle('opacity-50', disable);
                el.classList.toggle('cursor-not-allowed', disable);
                if (disable) {
                    el.setAttribute('title', 'Database is not connected');
                } else {
                    el.removeAttribute('title');
                }
            });
        }

        async function checkDbConnection() {
            try {
                const res = await fetch('db_status.php', {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = await res.json();
               await updateDbStatusUI(!!data.connected);
                if (!data.connected && data.error) {
                    console.warn('DB disconnected:', data.error);
                }
            } catch (e) {
                console.warn('DB status check failed:', e);
                updateDbStatusUI(false, String(e));
            }
        }

        // Navigation
        function showSection(sectionId, clickedElement = null, ev = null) {
            // Prevent default anchor behavior when invoked from <a href="#">
            if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
            // If element requires DB and DB is disconnected, block navigation
            if (clickedElement && clickedElement.hasAttribute('data-requires-db') && !isDbConnected) {
                showToast('Database not connected', 'error');
                return false;
            }
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Remove active class from all sidebar links
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
            });

            // Show selected section
            const targetSection = document.getElementById(sectionId);
            targetSection.classList.add('active');

            // Add active class to clicked link
            if (clickedElement) {
                clickedElement.classList.add('active');
            }
            // Ensure the corresponding sidebar link is highlighted even if a non-sidebar control triggered navigation
            document.querySelectorAll('.sidebar-link').forEach(link => {
                const oc = link.getAttribute('onclick') || '';
                if (oc.includes("showSection('" + sectionId + "'")) {
                    link.classList.add('active');
                }
            });

            // Load content based on section
            if (sectionId === 'migrations') {
                loadMigrations();
            } else if (sectionId === 'seeders') {
                loadSeeders();
            } else if (sectionId === 'workflows') {
                // Ensure editor and list when entering workflows
                ensureWfEditor(() => {
                    try {
                        window.__wfEditor.layout();
                    } catch (e) {}
                });
                listWorkflows();
            }

            // Close sidebar on mobile after navigation
            if (window.innerWidth < 769) {
                toggleSidebar();
            }

            // Update URL hash for deep-linking and refresh persistence
            try {
                window.__navByCode = true;
                if (location.hash !== '#' + sectionId) location.hash = sectionId;
                // small timeout to release the flag after hashchange fires
                setTimeout(() => { window.__navByCode = false; }, 0);
            } catch (_) {}
        }

        // Hash routing: allow deep links and refresh to keep section
        const __validSections = new Set(['dashboard','migrations','seeders','composer','workflows']);
        function navigateToHash() {
            const hash = (location.hash || '').replace(/^#/, '');
            if (__validSections.has(hash)) {
                // Find the corresponding sidebar link if available
                let link = null;
                document.querySelectorAll('.sidebar-link').forEach(a => {
                    const oc = a.getAttribute('onclick') || '';
                    if (oc.includes("showSection('" + hash + "'")) link = a;
                });
                showSection(hash, link);
                return true;
            }
            return false;
        }
        window.addEventListener('hashchange', () => {
            if (window.__navByCode) return; // ignore programmatic updates
            navigateToHash();
        });
        // On initial load: check DB first, then route
        document.addEventListener('DOMContentLoaded', async () => {
            try { await checkDbConnection(); } catch (_) {}
            const navigated = navigateToHash();
            if (!navigated) {
                // default to dashboard and highlight link
                let dashLink = null;
                document.querySelectorAll('.sidebar-link').forEach(a => {
                    const oc = a.getAttribute('onclick') || '';
                    if (oc.includes("showSection('dashboard'")) dashLink = a;
                });
                showSection('dashboard', dashLink);
            }
        });

        // Toast System
        function showToast(message, type = 'info', timeout = 2000) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');

            const theme = {
                success: {
                    bgcolor: 'bg-green-800',
                    color: 'text-green-800',
                    icon: 'fa-check-circle',
                    accent: 'toast-accent-success'
                },
                error: {
                    bgcolor: 'bg-red-800',
                    color: 'text-red-800',
                    icon: 'fa-circle-exclamation',
                    accent: 'toast-accent-error'
                },
                warning: {
                    bgcolor: 'bg-yellow-800',
                    color: 'text-yellow-800',
                    icon: 'fa-triangle-exclamation',
                    accent: 'toast-accent-warning'
                },
                info: {
                    bgcolor: 'bg-blue-800',
                    color: 'text-blue-800',
                    icon: 'fa-circle-info',
                    accent: 'toast-accent-info'
                }
            } [type] || {
                bgcolor: 'bg-gray-800',
                color: 'text-gray-800',
                icon: 'fa-circle-info',
                accent: 'toast-accent-info'
            };

            toast.className = `toast ${theme.accent} overflow-hidden rounded-xl p-3 pl-4 flex items-start gap-3 relative`;
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.innerHTML = `
                <div class="pt-0.5">
                    <i class="fas ${theme.icon} ${theme.color}"></i>
                </div>
                <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">${message}</div>
                </div>
                <button class="text-gray-400 hover:text-gray-600 transition" aria-label="Close" onclick="(function(btn){ const t=btn.closest('.toast'); t.classList.add('toast-leave'); setTimeout(()=>t.remove(), 220); })(this)">
                    <i class="fas fa-times"></i>
                </button>
                ${timeout ? '<div class="absolute left-0 bottom-0 h-0.5 bg-gray-200 w-full overflow-hidden"><div class="h-full '+theme.bgcolor+' opacity-60" style="animation: toast-progress '+timeout+'ms linear forwards"></div></div>' : ''}
            `;

            // progress bar animation keyframes (inline once)
            if (!document.getElementById('toast-progress-style')) {
                const s = document.createElement('style');
                s.id = 'toast-progress-style';
                s.textContent = '@keyframes toast-progress { from { transform: translateX(0); width: 100% } to { transform: translateX(100%); width: 0 } }';
                document.head.appendChild(s);
            }

            container.appendChild(toast);

            if (timeout) {
                setTimeout(() => {
                    toast.classList.add('toast-leave');
                    setTimeout(() => toast.remove(), 220);
                }, timeout);
            }
        }

        // Confirm Dialog
        let riveConfirmInstance = null;

        function confirmAction(message, confirmText = 'Confirm', cancelText = 'Cancel') {
            return new Promise((resolve) => {
                const modal = document.getElementById('confirm-modal');
                const msgEl = document.getElementById('confirm-message');
                const yesBtn = document.getElementById('confirm-yes');
                const noBtn = document.getElementById('confirm-no');
                const canvas = document.getElementById('rive-confirm-canvas');
                const fallback = document.getElementById('fallback-confirm-spinner');

                msgEl.textContent = message;
                yesBtn.textContent = confirmText;
                noBtn.textContent = cancelText;

                const cleanup = () => {
                    yesBtn.removeEventListener('click', onYes);
                    noBtn.removeEventListener('click', onNo);
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    document.body.classList.remove('modal-open');
                    if (riveConfirmInstance && typeof riveConfirmInstance.pause === 'function') {
                        try {
                            riveConfirmInstance.pause();
                        } catch (e) {}
                    }
                };

                const onYes = () => {
                    cleanup();
                    resolve(true);
                };

                const onNo = () => {
                    cleanup();
                    resolve(false);
                };

                yesBtn.addEventListener('click', onYes);
                noBtn.addEventListener('click', onNo);

                // Show modal centered
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.classList.add('modal-open');
            });
        }

        // Loading System (simplified, no Rive)
        function showLoading(text = 'Processing...') {
            const modal = document.getElementById('loading-modal');
            document.getElementById('loading-text').textContent = text;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.classList.add('modal-open');
        }

        function hideLoading() {
            const modal = document.getElementById('loading-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.classList.remove('modal-open');
        }

        // Sidebar progress updater
        function updateSidebarProgress(ran, total) {
            const bar = document.getElementById('sidebar-migration-progress-bar');
            const text = document.getElementById('sidebar-migration-progress-text');
            if (!bar || !text) return;
            const pct = total > 0 ? Math.round((ran / total) * 100) : 0;
            bar.style.width = pct + '%';
            text.textContent = `${pct}% Executed`;
        }

        // Composer helpers
        function setComposerOutput(text) {
            const el = document.getElementById('composer-output');
            if (el) el.textContent = text || '';
        }

        async function checkComposerStatus() {
            showLoading('Checking composer status...');
            try {
                const res = await fetch('composer_handler.php?action=status', {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();
                if (data && data.success) {
                    const lines = [];
                    lines.push('Composer: ' + (data.composer_version || 'unknown'));
                    lines.push('vendor/ present: ' + (!!data.vendor_present));
                    lines.push('composer.lock present: ' + (!!data.lock_present));
                    setComposerOutput(lines.join('\n'));
                } else {
                    setComposerOutput('Error: ' + (data && (data.error || data.message) ? (data.error || data.message) : 'Unknown error'));
                }
            } catch (e) {
                setComposerOutput('Error: ' + (e && e.message ? e.message : String(e)));
            } finally {
                hideLoading();
            }
        }

        async function installComposerDeps() {
            showLoading('Installing dependencies...');
            try {
                const res = await fetch('composer_handler.php?action=install', {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();
                if (data && data.success) {
                    setComposerOutput((data.output || []).join('\n'));
                } else {
                    const err = (data && (data.error || data.message)) || 'Unknown error';
                    const out = (data && data.output) ? data.output.join('\n') : '';
                    setComposerOutput('Install failed: ' + err + (out ? ('\n' + out) : ''));
                }
            } catch (e) {
                setComposerOutput('Error: ' + (e && e.message ? e.message : String(e)));
            } finally {
                hideLoading();
            }
        }

        async function dumpComposerAutoload() {
            showLoading('Dumping autoload...');
            try {
                const res = await fetch('composer_handler.php?action=dump', {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();
                if (data && data.success) {
                    setComposerOutput((data.output || []).join('\n'));
                } else {
                    const err = (data && (data.error || data.message)) || 'Unknown error';
                    const out = (data && data.output) ? data.output.join('\n') : '';
                    setComposerOutput('Dump failed: ' + err + (out ? ('\n' + out) : ''));
                }
            } catch (e) {
                setComposerOutput('Error: ' + (e && e.message ? e.message : String(e)));
            } finally {
                hideLoading();
            }
        }

        // Workflows helpers
        function wfSetCurrent(name) {
            window.__wfCurrent = name || '';
            const tag = document.getElementById('wf-current-name');
            if (tag) tag.textContent = name ? name : 'No file selected';
        }

        function wfRenderList(files) {
            const listEl = document.getElementById('wf-list');
            if (!listEl) return;
            if (!files || files.length === 0) {
                listEl.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500">No workflow files found.</div>';
                return;
            }
            listEl.innerHTML = files.map(f => `
                <button class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between" onclick="openWorkflow('${f.name.replace(/'/g, "&#39;")}')">
                    <span class="text-xs text-gray-800"><i class="far fa-file-code mr-2 text-gray-700"></i>${f.name}</span>
                    <span class="text-[10px] text-gray-400">${new Date((f.mtime||0)*1000).toLocaleString()}</span>
                </button>
            `).join('');
        }

        async function listWorkflows() {
            showLoading('Loading workflows...');
            try {
                const res = await fetch('workflows_handler.php?action=list', {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();
                if (data && data.success) {
                    wfRenderList(data.files || []);
                } else {
                    showToast((data && (data.error || data.message)) || 'Failed to load workflows', 'error');
                }
            } catch (e) {
                showToast(e.message || 'Error loading workflows', 'error');
            } finally {
                hideLoading();
            }
        }

        async function openWorkflow(name) {
            if (!name) return;
            showLoading('Opening workflow...');
            try {
                const res = await fetch('workflows_handler.php?action=read&file=' + encodeURIComponent(name), {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();
                if (data && data.success) {
                    if (window.__wfEditor) {
                        try {
                            window.__wfEditor.setValue(data.content || '');
                        } catch (_) {}
                    } else {
                        const ed = document.getElementById('wf-editor');
                        if (ed && 'value' in ed) ed.value = data.content || '';
                    }
                    wfSetCurrent(data.file || name);
                    // Update secrets list for loaded content
                    try {
                        wfRenderSecrets(wfParseSecrets(data.content || ''));
                    } catch (_) {}
                } else {
                    showToast((data && (data.error || data.message)) || 'Failed to open file', 'error');
                }
            } catch (e) {
                showToast(e.message || 'Error opening file', 'error');
            } finally {
                hideLoading();
            }
        }

        async function saveWorkflow() {
            const name = window.__wfCurrent;
            if (!name) {
                showToast('No file selected', 'error');
                return;
            }
            let content = '';
            if (window.__wfEditor) {
                try {
                    content = window.__wfEditor.getValue();
                } catch (_) {
                    content = '';
                }
            } else {
                const ed = document.getElementById('wf-editor');
                content = ed && 'value' in ed ? ed.value : '';
            }
            showLoading('Saving...');
            try {
                const res = await fetch('workflows_handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    body: new URLSearchParams({
                        action: 'save',
                        file: name,
                        content
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    showToast('Workflow saved', 'success');
                    listWorkflows();
                } else {
                    showToast((data && (data.error || data.message)) || 'Save failed', 'error');
                }
            } catch (e) {
                showToast(e.message || 'Save error', 'error');
            } finally {
                hideLoading();
            }
        }

        // Open create workflow modal
        function createWorkflow() {
            const modal = document.getElementById('wf-create-modal');
            const input = document.getElementById('wf-create-name');
            if (!modal || !input) return;
            input.value = '';
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.classList.add('modal-open');
            setTimeout(() => input.focus(), 50);
        }

        // Wire up modal buttons once DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('wf-create-modal');
            const closeBtn = document.getElementById('wf-create-close');
            const cancelBtn = document.getElementById('wf-create-cancel');
            const saveBtn = document.getElementById('wf-create-save');
            const input = document.getElementById('wf-create-name');

            function hideWfCreate() {
                if (!modal) return;
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.classList.remove('modal-open');
            }

            function validYamlName(name) {
                if (!name) return false;
                const trimmed = name.trim();
                if (!/^[-_.a-zA-Z0-9]+\.(yml|yaml)$/i.test(trimmed)) return false;
                return true;
            }

            async function submitWfCreate() {
                const name = input ? input.value.trim() : '';
                if (!validYamlName(name)) {
                    showToast('Enter a valid .yml or .yaml file name', 'error');
                    if (input) input.focus();
                    return;
                }
                const content = `name: ${name.replace(/\.(yml|yaml)$/i,'')}\n\non:\n  push:\n    branches: [ main ]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: echo \"Hello, Workflows!\"`;
                showLoading('Creating...');
                try {
                    const res = await fetch('workflows_handler.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json'
                        },
                        body: new URLSearchParams({
                            action: 'create',
                            file: name,
                            content
                        })
                    });
                    const data = await res.json();
                    if (data && data.success) {
                        showToast('Workflow created', 'success');
                        listWorkflows();
                        wfSetCurrent(name);
                        openWorkflow(name);
                        hideWfCreate();
                    } else {
                        showToast((data && (data.error || data.message)) || 'Create failed', 'error');
                    }
                } catch (e) {
                    showToast(e.message || 'Create error', 'error');
                } finally {
                    hideLoading();
                }
            }

            if (closeBtn) closeBtn.addEventListener('click', hideWfCreate);
            if (cancelBtn) cancelBtn.addEventListener('click', hideWfCreate);
            if (saveBtn) saveBtn.addEventListener('click', submitWfCreate);
            if (input) input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submitWfCreate();
            });
        });

        // Code viewer helpers
        function escapeHtml(str) {
            if (typeof str !== 'string') return '';
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // Generic confirm modal helper
        function showConfirm(message = 'Are you sure?', onYes = null, onNo = null) {
            const modal = document.getElementById('confirm-modal');
            const msgEl = document.getElementById('confirm-message');
            const yesBtn = document.getElementById('confirm-yes');
            const noBtn = document.getElementById('confirm-no');
            if (!modal || !msgEl || !yesBtn || !noBtn) {
                if (confirm(message)) onYes && onYes();
                else onNo && onNo();
                return;
            }
            msgEl.textContent = message;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.classList.add('modal-open');

            const cleanup = () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.classList.remove('modal-open');
                yesBtn.removeEventListener('click', yesHandler);
                noBtn.removeEventListener('click', noHandler);
            };
            const yesHandler = () => {
                cleanup();
                onYes && onYes();
            };
            const noHandler = () => {
                cleanup();
                onNo && onNo();
            };
            yesBtn.addEventListener('click', yesHandler);
            noBtn.addEventListener('click', noHandler);
        }

        // Delete current workflow
        async function deleteWorkflow() {
            const name = window.__wfCurrent;
            if (!name) {
                showToast('No file selected', 'error');
                return;
            }
            document.body.classList.add('modal-open');

            showConfirm(`Delete workflow "${name}"? This cannot be undone.`, async () => {
                showLoading('Deleting...');
                try {
                    const res = await fetch('workflows_handler.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json'
                        },
                        body: new URLSearchParams({
                            action: 'delete',
                            file: name
                        })
                    });
                    const data = await res.json();
                    if (data && data.success) {
                        showToast('Workflow deleted', 'success');
                        // Clear editor and current
                        if (window.__wfEditor) {
                            try {
                                window.__wfEditor.setValue('');
                            } catch (_) {}
                        } else {
                            const ed = document.getElementById('wf-editor');
                            if (ed && 'value' in ed) ed.value = '';
                        }
                        wfSetCurrent('');
                        listWorkflows();
                        wfRenderSecrets([]);
                    } else {
                        showToast((data && (data.error || data.message)) || 'Delete failed', 'error');
                    }
                } catch (e) {
                    showToast(e.message || 'Delete error', 'error');
                } finally {
                    hideLoading();
                }
            });
        }

        async function openCodeModal(kind, file) {
            const modal = document.getElementById('code-viewer-modal');
            const title = document.getElementById('code-viewer-title');
            const content = document.getElementById('code-viewer-content');
            title.textContent = file || 'File';
            content.innerHTML = '<span class="text-gray-500">Loading...</span>';
            modal.classList.remove('hidden');
            modal.classList.add('flex');

            try {
                const url = kind === 'migration' ?
                    `migration_handler.php?action=view&file=${encodeURIComponent(file)}` :
                    `seeder_handler.php?action=view&file=${encodeURIComponent(file)}`;
                const res = await fetch(url, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();
                document.body.classList.add('modal-open');
                if (data && data.success && typeof data.code === 'string') {
                    content.innerHTML = `<code>${escapeHtml(data.code)}</code>`;
                } else {
                    const err = (data && (data.error || data.message)) || 'Failed to load file.';
                    content.innerHTML = `<span class="text-red-600">${escapeHtml(err)}</span>`;
                }
            } catch (e) {
                content.innerHTML = `<span class="text-red-600">${escapeHtml(e.message || 'Error loading file')}</span>`;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const closeBtn = document.getElementById('code-viewer-close');
            const modal = document.getElementById('code-viewer-modal');
            if (closeBtn) closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            });
            // Close when clicking overlay
            if (modal) modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            });
        });

        // Migration Functions
        function loadMigrations() {
            if (!isDbConnected) {
                showToast('Database not connected', 'error');
                return;
            }
            showLoading('Loading migrations...');
            fetch('migration_handler.php?action=list')
                .then(response => response.json())
                .then(data => {
                    displayMigrations(data);
                    hideLoading();
                })
                .catch(error => {
                    console.error('Error:', error);
                    hideLoading();
                    showToast('Error loading migrations', 'error');
                });
        }

        function displayMigrations(data) {
            const migrationsList = document.getElementById('migrations-list');
            const migrationStatus = document.getElementById('migration-status');

            // Update status
            migrationStatus.innerHTML = `
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <div class="text-xl font-semibold">${data.ran || 0}</div>
                        <div class="text-sm text-gray-500">Completed</div>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <div class="text-xl font-semibold">${data.pending || 0}</div>
                        <div class="text-sm text-gray-500">Pending</div>
                    </div>
                </div>
            `;

            // Update migrations list
            if (data.migrations && data.migrations.length > 0) {
                migrationsList.innerHTML = data.migrations.map(migration => `
                    <div class="px-3 pb-3 border-b border-gray-200 hover:border-gray-300 transition">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-medium text-xs">
                                    <button class="text-black hover:underline" onclick="openCodeModal('migration', '${migration.file}')" title="View code">${migration.name}</button>
                                </div>
                                
                            </div>
                            <div class="flex items-center space-x-3">
                                <span class="status-badge ${migration.status === 'ran' ? 'status-completed' : 'status-pending'}">
                                    ${migration.status === 'ran' ? 'Completed' : 'Pending'}
                                </span>
                                ${migration.status === 'pending' ? `
                                    <button data-requires-db ${!isDbConnected ? 'disabled title="Database is not connected" class="btn btn-primary px-3 text-xs opacity-50 cursor-not-allowed"' : `class="btn btn-primary px-3 text-xs" onclick="runMigration('${migration.file}')"`}>
                                        Run
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('');
                // Update sidebar progress with latest stats
                updateSidebarProgress(Number(data.ran || 0), Number(data.total || 0));
            } else {
                migrationsList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        No migrations found
                    </div>
                `;
                updateSidebarProgress(0, 0);
            }
        }

        // Seeder Functions
        function loadSeeders() {
            if (!isDbConnected) {
                showToast('Database not connected', 'error');
                return;
            }
            showLoading('Loading seeders...');
            fetch('seeder_handler.php?action=list')
                .then(response => response.json())
                .then(data => {
                    displaySeeders(data);
                    hideLoading();
                })
                .catch(error => {
                    console.error('Error:', error);
                    hideLoading();
                    showToast('Error loading seeders', 'error');
                });
        }

        function displaySeeders(data) {
            const seedersList = document.getElementById('seeders-list');

            if (data.seeders && data.seeders.length > 0) {
                seedersList.innerHTML = data.seeders.map(seeder => `
                    <div class="px-3 pb-2.5 border-b border-gray-200 hover:border-gray-300 transition">
                        <div class="flex items-center justify-between">
                            <div>
                            
                                <div class="text-sm text-gray-500">
                                    <button class="text-gray-600 hover:underline" onclick="openCodeModal('seeder', '${seeder.file}')" title="View code">${seeder.file}</button>
                                </div>
                            </div>
                            <button data-requires-db ${!isDbConnected ? 'disabled title="Database is not connected" class="btn btn-secondary px-3 py-0 text-xs opacity-50 cursor-not-allowed"' : 'class="btn btn-secondary px-3 py-0 text-xs" onclick="runSeeder(\'' + seeder.class + '\')"'}>
                                Execute
                            </button>
                        </div>
                    </div>
                `).join('');
            } else {
                seedersList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        No seeders found
                    </div>
                `;
            }
        }

        // API Functions
        async function runMigration(migrationFile) {
            if (!isDbConnected) {
                showToast('Database not connected', 'error');
                return;
            }
            const confirmed = await confirmAction(
                `Run the migration "${migrationFile}"?`,
                'Run Migration'
            );
            if (!confirmed) return;

            showLoading('Running migration...');
            fetch('migration_handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'run',
                        migration: migrationFile
                    })
                })
                .then(res => res.json())
                .then(data => {
                    hideLoading();
                    if (data.success) {
                        showToast('Migration completed', 'success');
                        loadMigrations();
                    } else {
                        showToast(data.error || 'Error running migration', 'error');
                    }
                })
                .catch(err => {
                    hideLoading();
                    showToast('Error running migration', 'error');
                });
        }

        async function runAllMigrations() {
            if (!isDbConnected) {
                showToast('Database not connected', 'error');
                return;
            }
            const confirmed = await confirmAction(
                'Run all pending migrations?',
                'Run All'
            );
            if (!confirmed) return;

            showLoading('Running all migrations...');
            fetch('migration_handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'run_all'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    hideLoading();
                    if (data.success) {
                        showToast('All migrations completed', 'success');
                        loadMigrations();
                    } else {
                        showToast(data.error || 'Error running migrations', 'error');
                    }
                })
                .catch(err => {
                    hideLoading();
                    showToast('Error running migrations', 'error');
                });
        }

        async function runSeeder(seederClass) {
            if (!isDbConnected) {
                showToast('Database not connected', 'error');
                return;
            }
            const confirmed = await confirmAction(
                `Run the ${seederClass} seeder?`,
                'Run Seeder'
            );
            if (!confirmed) return;

            showLoading('Running seeder...');
            fetch('seeder_handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'run',
                        seeder: seederClass
                    })
                })
                .then(res => res.json())
                .then(data => {
                    hideLoading();
                    if (data.success) {
                        showToast('Seeder completed', 'success');
                        loadSeeders();
                    } else {
                        showToast(data.error || 'Error running seeder', 'error');
                    }
                })
                .catch(err => {
                    hideLoading();
                    showToast('Error running seeder', 'error');
                });
        }

        async function runAllSeeders() {
            const confirmed = await confirmAction(
                'Run all seeders?',
                'Run All'
            );
            if (!confirmed) return;

            showLoading('Running all seeders...');
            fetch('seeder_handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'run_all'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    hideLoading();
                    if (data.success) {
                        showToast('All seeders completed', 'success');
                        loadSeeders();
                    } else {
                        showToast(data.error || 'Error running seeders', 'error');
                    }
                })
                .catch(err => {
                    hideLoading();
                    showToast('Error running seeders', 'error');
                });
        }

        async function rollbackSeeders() {
            if (!isDbConnected) {
                showToast('Database not connected', 'error');
                return;
            }
            const confirmed = await confirmAction(
                '⚠️ This will DROP ALL TABLES and run fresh migrations with seeders. Continue?',
                'Yes, Fresh Seed'
            );
            if (!confirmed) return;

            showLoading('Running fresh migration with seeders...');
            fetch('seeder_handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'fresh_seed'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    hideLoading();
                    if (data.success) {
                        showToast('Fresh migration completed', 'success');
                        loadMigrations();
                        loadSeeders();
                    } else {
                        showToast(data.error || 'Error running fresh seed', 'error');
                    }
                })
                .catch(err => {
                    hideLoading();
                    showToast('Error running fresh seed', 'error');
                });
        }

        // Refresh functions
        function refreshMigrations() {
            showToast('Refreshing migrations...', 'info', 2000);
            loadMigrations();
        }

        function refreshSeeders() {
            showToast('Refreshing seeders...', 'info', 2000);
            loadSeeders();
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Welcome message
            setTimeout(() => {
                showToast('Welcome to Project Toolkit', 'success');
            }, 1000);
        });

        // Close modals on outside click
        // document.addEventListener('click', function(e) {
        //     if (e.target.classList.contains('fixed')) {
        //         e.target.classList.add('hidden');
        //     }
        // });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.fixed').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        });
    </script>
    <script>
        // Populate dashboard counts for migrations and seeders with counter animation
        document.addEventListener('DOMContentLoaded', async function() {
            const elRun = document.getElementById('count-migrations-run');
            const elPending = document.getElementById('count-migrations-pending');
            const elSeeders = document.getElementById('count-seeders');

            function animateCount(el, to, duration = 1200) {
                if (!el) return;
                const start = 0;
                const startTime = performance.now();
                const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

                function frame(now) {
                    const elapsed = now - startTime;
                    const t = Math.min(1, elapsed / duration);
                    const eased = easeOutCubic(t);
                    const val = Math.round(start + (to - start) * eased);
                    el.textContent = String(val);
                    if (t < 1) requestAnimationFrame(frame);
                }
                requestAnimationFrame(frame);
            }

            // Initial DB status
            await checkDbConnection();

            if (!isDbConnected) {
                animateCount(elRun, 0);
                animateCount(elPending, 0);
                animateCount(elSeeders, 0);
            } else {
                try {
                    // Fetch migrations status (supports default GET or ?action=list)
                    const resMig = await fetch('migration_handler.php', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    let run = 0,
                        pending = 0;
                    if (resMig.ok) {
                        const data = await resMig.json();
                        const list = Array.isArray(data) ? data : (Array.isArray(data.migrations) ? data.migrations : []);
                        if (list.length) {
                            list.forEach(m => ((m.status || '').toLowerCase().includes('ran') || m.ran === true) ? run++ : pending++);
                        } else if (typeof data.ran === 'number' || typeof data.pending === 'number') {
                            run = Number(data.ran || 0);
                            pending = Number(data.pending || 0);
                        }
                        const total = typeof data.total === 'number' ? Number(data.total) : (run + pending);
                        updateSidebarProgress(run, total);
                    }
                    animateCount(elRun, run);
                    animateCount(elPending, pending);
                } catch (e) {
                    // ignore
                }

                try {
                    // Fetch seeders list (supports default GET or { seeders: [] })
                    const resSeed = await fetch('seeder_handler.php', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    let count = 0;
                    if (resSeed.ok) {
                        const data = await resSeed.json();
                        count = Array.isArray(data) ? data.length : (Array.isArray(data.seeders) ? data.seeders.length : (typeof data.count === 'number' ? data.count : 0));
                    }
                    animateCount(elSeeders, count);
                } catch (e) {
                    // ignore
                }
            }

            // Poll DB status periodically to keep UI in sync
            setInterval(checkDbConnection, 20000);
        });
    </script>
    <script>
        // Fixed + collapsible sidebar logic
        (function() {
            const body = document.body;
            const STORAGE_KEY = 'php_gms_sidebar_collapsed';
            const sidebar = document.getElementById('sidebar');
            const toggleBtn = document.getElementById('sidebar-toggle');
            const overlay = document.getElementById('sidebar-overlay');
            const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

            function applyCollapsed(collapsed) {
                body.classList.add('with-sidebar');
                body.classList.toggle('sidebar-collapsed', collapsed);
                if (sidebar) sidebar.classList.toggle('collapsed', collapsed);
            }

            function setToggleIcon(open) {
                const icon = document.querySelector('#sidebar-toggle i');
                if (!icon) return;
                if (!isMobile()) {
                    // Always show bars on desktop
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                    return;
                }
                icon.classList.toggle('fa-bars', !open);
                icon.classList.toggle('fa-times', open);
            }

            // Ensure sidebar link labels are wrapped for smooth hide on collapse
            function ensureLinkTextWrappers() {
                const links = sidebar ? sidebar.querySelectorAll('a.sidebar-link') : [];
                links.forEach(a => {
                    if (a.querySelector('.link-text')) return;
                    // Skip the icon element (i) and wrap remaining text/inline nodes
                    const nodes = Array.from(a.childNodes);
                    // Find first <i> (icon)
                    let startIdx = 0;
                    for (let i = 0; i < nodes.length; i++) {
                        if (nodes[i].nodeType === 1 && nodes[i].tagName === 'I') {
                            startIdx = i + 1;
                            break;
                        }
                    }
                    const span = document.createElement('span');
                    span.className = 'link-text';
                    // Move non-empty text nodes and inline elements into span
                    for (let i = startIdx; i < nodes.length; i++) {
                        const n = nodes[i];
                        if (!n) continue;
                        if (n.nodeType === 3) {
                            if (n.textContent.trim()) span.appendChild(document.createTextNode(n.textContent.trim()));
                            n.textContent = '';
                        } else if (n.nodeType === 1 && !n.classList.contains('badge') && !n.classList.contains('chevron')) {
                            span.appendChild(n);
                        }
                    }
                    if (span.childNodes.length) a.appendChild(span);
                });
            }

            function getStored() {
                try {
                    return localStorage.getItem(STORAGE_KEY) === '1';
                } catch (e) {
                    return false;
                }
            }

            function setStored(collapsed) {
                try {
                    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
                } catch (e) {}
            }

            // Initialize
            ensureLinkTextWrappers();
            if (isMobile()) {
                applyCollapsed(true);
                if (sidebar) sidebar.classList.remove('open');
                body.classList.remove('sidebar-open');
                setToggleIcon(false);
            } else {
                applyCollapsed(getStored());
                setToggleIcon(false);
            }

            function toggleSidebar() {
                if (isMobile()) {
                    if (!sidebar) return;
                    const open = sidebar.classList.toggle('open');
                    body.classList.toggle('sidebar-open', open);
                    // When open on mobile, fully expand; when closed, collapse
                    applyCollapsed(!open ? true : false);
                    setToggleIcon(open);
                    return;
                }
                const next = !body.classList.contains('sidebar-collapsed');
                applyCollapsed(next);
                setStored(next);
                setToggleIcon(false);
            }

            // Wire up buttons
            if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            if (mobileBtn) mobileBtn.addEventListener('click', toggleSidebar);
            if (overlay) overlay.addEventListener('click', () => {
                if (!isMobile()) return;
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
                // restore collapsed when closing via overlay
                applyCollapsed(true);
                setToggleIcon(false);
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isMobile()) {
                    sidebar.classList.remove('open');
                    document.body.classList.remove('sidebar-open');
                    // restore collapsed when closing via ESC
                    applyCollapsed(true);
                    setToggleIcon(false);
                }
            });
            window.addEventListener('resize', () => {
                if (isMobile()) {
                    // collapse and close when entering mobile
                    applyCollapsed(true);
                    sidebar.classList.remove('open');
                    document.body.classList.remove('sidebar-open');
                    setToggleIcon(false);
                } else {
                    setToggleIcon(false);
                }
            });

            // Infinite organic blob motion: periodically randomize transforms
            function rand(min, max) {
                return Math.random() * (max - min) + min;
            }
            let blobTimer = null;

            function updateBlobs() {
                if (!sidebar) return;
                const ax = rand(-30, 30).toFixed(1) + 'px';
                const ay = rand(-20, 25).toFixed(1) + 'px';
                const as = rand(0.95, 1.08).toFixed(3);
                const bx = rand(-25, 35).toFixed(1) + 'px';
                const by = rand(-30, 20).toFixed(1) + 'px';
                const bs = rand(0.95, 1.08).toFixed(3);
                sidebar.style.setProperty('--blob-a-x', ax);
                sidebar.style.setProperty('--blob-a-y', ay);
                sidebar.style.setProperty('--blob-a-s', as);
                sidebar.style.setProperty('--blob-b-x', bx);
                sidebar.style.setProperty('--blob-b-y', by);
                sidebar.style.setProperty('--blob-b-s', bs);
            }

            function startBlobTimer() {
                if (blobTimer) return;
                updateBlobs();
                const tick = () => {
                    updateBlobs();
                    blobTimer = setTimeout(tick, 10000); // match --blob-trans default 10s
                };
                blobTimer = setTimeout(tick, 10000);
            }

            function stopBlobTimer() {
                if (blobTimer) {
                    clearTimeout(blobTimer);
                    blobTimer = null;
                }
            }
            if (sidebar) {
                startBlobTimer();
                // Speed up and force fresh target on hover
                sidebar.addEventListener('mouseenter', () => {
                    updateBlobs();
                });
                // Pause when tab hidden to save resources
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) stopBlobTimer();
                    else startBlobTimer();
                });
            }

            // Expose for inline handlers if any exist
            window.toggleSidebar = toggleSidebar;
            // Back-compat shim: some legacy code may call applyState(collapsed)
            window.applyState = applyCollapsed;
        })();
    </script>
    <script>
        // Use CDN-hosted Rive animations so no local assets folder is required
        window.RIVE_LOADER_URL = 'https://cdn.rive.app/animations/loader.riv';
        window.RIVE_CONFIRM_URL = 'https://cdn.rive.app/animations/loader.riv';
    </script>
</body>

</html>