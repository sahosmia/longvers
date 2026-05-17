<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
      public function index()
    {
        $query = Product::with(['category', 'outletPrices'])->latest();

        if (request('filter') === 'low_stock') {
            $query->where('stock', '>', 0)->where('stock', '<=', 10);
        } elseif (request('filter') === 'out_of_stock') {
            $query->where('stock', '<=', 0);
        }

        return Inertia::render('products/index', [
            'products' => $query->get(),
            'categories' => \App\Models\Category::all(),
            'outlets' => \App\Models\Outlet::all(),
            'units' => \App\Models\Unit::all(),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        $outletPrices = $validated['outlet_prices'] ?? [];
        unset($validated['outlet_prices']);

        $product = Product::create($validated);

        foreach ($outletPrices as $op) {
            $product->outletPrices()->create($op);
        }

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();
        $outletPrices = $validated['outlet_prices'] ?? [];
        unset($validated['outlet_prices']);

        $product->update($validated);

        $product->outletPrices()->delete();
        foreach ($outletPrices as $op) {
            $product->outletPrices()->create($op);
        }

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
