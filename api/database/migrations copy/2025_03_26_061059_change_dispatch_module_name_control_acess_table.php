<?php

use App\Models\ControlAccess;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        ControlAccess::where('module_name', 'Warehousing')
            ->where('form_name', 'Dispatch')
            ->update(['module_name' => 'Logistics', 'form_name' => 'Scheduling']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        ControlAccess::where('module_name', 'Logistics')
            ->where('form_name', 'Scheduling')
            ->update(['module_name' => 'Warehousing', 'form_name' => 'Dispatch']);
    }
};
