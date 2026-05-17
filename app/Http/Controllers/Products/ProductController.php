<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Models\Category;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->with([
                'category:id,name',
                'unit:id,name',
                'outletPrices.outlet:id,name',
            ])
            ->latest()
            ->get();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => Category::query()
                ->select('id', 'name')
                ->get(),

            'units' => Unit::query()
                ->select('id', 'name')
                ->get(),

            'outlets' => Outlet::query()
                ->select('id', 'name')
                ->get(),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();

            // Upload Image
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('products', 'public');
            }

            // Outlet Prices
            $outletPrices = $this->filterOutletPrices($data['outlet_prices'] ?? []);
            unset($data['outlet_prices']);

            // Create Product
            $product = Product::create($data);

            // Create Outlet Prices
            if (!empty($outletPrices)) {
                $product->outletPrices()->createMany($outletPrices);
            }

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Product created successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            // Delete uploaded image if transaction fails
            if (!empty($data['image'])) {
                Storage::disk('public')->delete($data['image']);
            }

            return redirect()
                ->back()
                ->with('error', 'Failed to create product.');
        }
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();

            // Upload New Image
            if ($request->hasFile('image')) {

                // Delete old image
                if ($product->image && Storage::disk('public')->exists($product->image)) {
                    Storage::disk('public')->delete($product->image);
                }

                $data['image'] = $request->file('image')->store('products', 'public');
            } else {
                unset($data['image']);
            }

            // Outlet Prices
            $outletPrices = $this->filterOutletPrices($data['outlet_prices'] ?? []);
            unset($data['outlet_prices']);

            // Update Product
            $product->update($data);

            // Refresh Outlet Prices
            $product->outletPrices()->delete();

            if (!empty($outletPrices)) {
                $product->outletPrices()->createMany($outletPrices);
            }

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Product updated successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Failed to update product.');
        }
    }

    public function destroy(Product $product): RedirectResponse
    {
        DB::beginTransaction();

        try {

            // Delete Image
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            // Delete Outlet Prices
            $product->outletPrices()->delete();

            // Delete Product
            $product->delete();

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Product deleted successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Failed to delete product.');
        }
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->input('ids', []);

        DB::beginTransaction();

        try {

            // Delete All Products
            if (empty($ids)) {

                $products = Product::all();

                foreach ($products as $product) {

                    if ($product->image && Storage::disk('public')->exists($product->image)) {
                        Storage::disk('public')->delete($product->image);
                    }

                    $product->outletPrices()->delete();
                }

                Product::query()->delete();

                DB::commit();

                return redirect()
                    ->back()
                    ->with('success', 'All products deleted successfully.');
            }

            // Delete Selected Products
            $products = Product::whereIn('id', $ids)->get();

            foreach ($products as $product) {

                if ($product->image && Storage::disk('public')->exists($product->image)) {
                    Storage::disk('public')->delete($product->image);
                }

                $product->outletPrices()->delete();
            }

            Product::whereIn('id', $ids)->delete();

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Selected products deleted successfully.');

        } catch (\Throwable $th) {

            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Failed to delete products.');
        }
    }

    /**
     * Filter valid outlet prices
     */
    private function filterOutletPrices(array $outletPrices): array
    {
        return array_values(array_filter($outletPrices, function ($item) {

            return isset($item['price']) &&
                $item['price'] !== null &&
                $item['price'] !== '';
        }));
    }
}
