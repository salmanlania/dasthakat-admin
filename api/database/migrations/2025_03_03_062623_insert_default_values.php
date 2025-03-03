<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Artisan::call('db:seed', ['--class' => 'ControlAccessSeeder']);
        Artisan::call('db:seed', ['--class' => 'CompanyAndBranchSeeder']);
        Artisan::call('db:seed', ['--class' => 'DocumentTypeSeeder']);
        Artisan::call('db:seed', ['--class' => 'UserPermissionSeeder']);
        Artisan::call('db:seed', ['--class' => 'UserSeeder']);
        Artisan::call('db:seed', ['--class' => 'ProductTypeSeeder']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
