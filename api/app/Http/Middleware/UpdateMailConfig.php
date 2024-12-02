<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Config;

class UpdateMailConfig
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Example: Retrieve settings from request or some external source
        $host = $request->input('mail_host', 'smtp.example.com');
        $port = $request->input('mail_port', 587);
        $encryption = $request->input('mail_encryption', 'tls');
        $username = $request->input('mail_username', 'username');
        $password = $request->input('mail_password', 'password');

        // Update mail configuration
        Config::set('mail.mailers.smtp.host', $host);
        Config::set('mail.mailers.smtp.port', $port);
        Config::set('mail.mailers.smtp.encryption', $encryption);
        Config::set('mail.mailers.smtp.username', $username);
        Config::set('mail.mailers.smtp.password', $password);

        return $next($request);
    }
}
