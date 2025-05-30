<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;

class DeployController extends Controller
{
    public function runMigrations()
    {
        try {
            $deployToken = request()->header('X-DEPLOY-TOKEN');
            if ($deployToken !== env('APP_KEY')) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            Artisan::call('migrate --force');
            return response()->json(['message' => 'Migrations run successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to run migrations: ' . $e->getMessage()], 500);
        }
    }
    public function runSeeders()
    {
        Artisan::call('db:seed');
        return response()->json(['message' => 'Seeders run successfully']);
    }
}
