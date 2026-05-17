<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $gents = Category::firstOrCreate(['name' => 'Gents'], ['slug' => 'gents']);
        $ladies = Category::firstOrCreate(['name' => 'Ladies'], ['slug' => 'ladies']);

        $pcs = Unit::firstOrCreate(['short_name' => 'pcs'], ['name' => 'Pieces']);
        $kg = Unit::firstOrCreate(['short_name' => 'kg'], ['name' => 'Kilogram']);

        $mainOutlet = Outlet::first() ?? Outlet::create(['name' => 'Main Outlet', 'location' => 'Dhaka']);
        $dhakaOutlet = Outlet::create(['name' => 'Dhaka Branch', 'location' => 'Dhaka']);

        $products = [
            [
                'name' => 'Premium Cotton Shirt',
                'category_id' => $gents->id,
                'unit_id' => $pcs->id,
                'price' => 1200,
                'outlet_prices' => [
                    ['outlet_id' => $dhakaOutlet->id, 'price' => 1300]
                ]
            ],
            [
                'name' => 'Slim Fit Jeans',
                'category_id' => $gents->id,
                'unit_id' => $pcs->id,
                'price' => 2500,
                'outlet_prices' => []
            ],
            [
                'name' => 'Designer Saree',
                'category_id' => $ladies->id,
                'unit_id' => $pcs->id,
                'price' => 5000,
                'outlet_prices' => [
                    ['outlet_id' => $mainOutlet->id, 'price' => 4800],
                    ['outlet_id' => $dhakaOutlet->id, 'price' => 5200]
                ]
            ],
            [
                'name' => 'Casual T-Shirt',
                'category_id' => $gents->id,
                'unit_id' => $pcs->id,
                'price' => 800,
                'outlet_prices' => []
            ],
        ];

        foreach ($products as $pData) {
            $outletPrices = $pData['outlet_prices'];
            unset($pData['outlet_prices']);

            $product = Product::create($pData);

            foreach ($outletPrices as $op) {
                $product->outletPrices()->create($op);
            }
        }
    }
}
