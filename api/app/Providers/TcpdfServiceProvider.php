<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use TCPDF;

class TcpdfServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('tcpdf', function ($app) {
            return new TCPDF();
        });
    }

    public function boot()
    {
        //
    }
}