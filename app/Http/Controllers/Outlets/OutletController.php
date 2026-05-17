<?php

namespace App\Http\Controllers\Outlets;

use App\Http\Controllers\Controller;
use App\Http\Requests\Outlets\StoreOutletRequest;
use App\Http\Requests\Outlets\UpdateOutletRequest;
use App\Models\Outlet;
use Inertia\Inertia;

class OutletController extends Controller
{
    public function index()
    {
        return Inertia::render('outlets/index', [
            'outlets' => Outlet::latest()->get(),
        ]);
    }

    public function store(StoreOutletRequest $request)
    {
        Outlet::create($request->validated());
        return redirect()->back()->with('success', 'Outlet created successfully.');
    }

    public function update(UpdateOutletRequest $request, Outlet $outlet)
    {
        $outlet->update($request->validated());
        return redirect()->back()->with('success', 'Outlet updated successfully.');
    }

    public function destroy(Outlet $outlet)
    {
        if ($outlet->invoices()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete outlet with associated invoices.');
        }
        $outlet->delete();
        return redirect()->back()->with('success', 'Outlet deleted successfully.');
    }

    public function bulkDestroy(\Illuminate\Http\Request $request)
    {
        $ids = $request->input('ids');
        if (empty($ids)) {
            // Check for associated invoices before deleting all
            if (\App\Models\Invoice::exists()) {
                 return redirect()->back()->with('error', 'Cannot delete all outlets as some have associated invoices.');
            }
            Outlet::query()->delete();
            return redirect()->back()->with('success', 'All outlets deleted successfully.');
        }

        $outletsWithInvoices = Outlet::whereIn('id', $ids)->whereHas('invoices')->count();
        if ($outletsWithInvoices > 0) {
            return redirect()->back()->with('error', 'Cannot delete some outlets as they have associated invoices.');
        }

        Outlet::whereIn('id', $ids)->delete();
        return redirect()->back()->with('success', 'Selected outlets deleted successfully.');
    }
}
