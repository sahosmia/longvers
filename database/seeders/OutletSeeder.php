<?php

namespace Database\Seeders;

use App\Models\Outlet;
use Illuminate\Database\Seeder;

class OutletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Outlet::create(['name' => 'Main Outlet', 'location' => 'Dhaka']);
        Outlet::create(['name' => 'Second Outlet', 'location' => 'Chittagong']);
    }
}
