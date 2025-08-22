<?php

namespace Database\Seeders;

use App\Models\ConstGlType;
use Illuminate\Database\Seeder;

class ConstGlTypeSeeder extends Seeder
{
    public function run(): void
    {
        ConstGlType::insert([
            ['gl_type_id' => 1, 'name' => 'Assets'],
            ['gl_type_id' => 2, 'name' => 'Liabilities'],
            ['gl_type_id' => 3, 'name' => 'Equity'],
            ['gl_type_id' => 4, 'name' => 'Revenue'],
            ['gl_type_id' => 5, 'name' => 'Expense'],
        ]);
    }
}
