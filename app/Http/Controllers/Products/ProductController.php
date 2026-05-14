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
        $query = Product::with('category')->latest();

        if (request('filter') === 'low_stock') {
            $query->where('stock', '>', 0)->where('stock', '<=', 10);
        } elseif (request('filter') === 'out_of_stock') {
            $query->where('stock', '<=', 0);
        }

        return Inertia::render('products/index', [
            'products' => $query->get(),
            'categories' => \App\Models\Category::all(),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        Product::create($request->validated());
        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());
        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
