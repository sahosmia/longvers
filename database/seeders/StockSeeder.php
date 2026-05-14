<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update existing products with random stock if they have 0
        Product::where('stock', 0)->each(function ($product) {
            $product->update(['stock' => rand(10, 50)]);
        });
    }
}
