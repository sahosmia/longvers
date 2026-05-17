<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $query = Product::with(['category', 'unit', 'outletPrices'])->latest();

        return Inertia::render('products/index', [
            'products' => $query->get(),
            'categories' => \App\Models\Category::all(),
            'units' => Unit::all(),
            'outlets' => Outlet::all(),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        $outletPrices = array_filter($validated['outlet_prices'] ?? [], function ($op) {
            return !empty($op['price']) || $op['price'] === "0" || $op['price'] === 0;
        });
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
        $outletPrices = array_filter($validated['outlet_prices'] ?? [], function ($op) {
            return !empty($op['price']) || $op['price'] === "0" || $op['price'] === 0;
        });
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
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
    public function bulkDestroy(\Illuminate\Http\Request $request)
    {
        $ids = $request->input('ids');
        if (empty($ids)) {
            Product::query()->delete();
            return redirect()->back()->with('success', 'All products deleted successfully.');
        }

        Product::whereIn('id', $ids)->delete();
        return redirect()->back()->with('success', 'Selected products deleted successfully.');
    }
}
