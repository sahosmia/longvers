<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoices\StoreInvoiceRequest;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Client;
use App\Services\InvoiceService;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function index()
    {
        return Inertia::render('invoices/index', [
            'invoices' => Invoice::with('client')->orderBy('date', 'desc')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('invoices/create', [
            'products' => Product::with('category')->get(),
            'clients' => Client::all(),
            'categories' => \App\Models\Category::all(),
        ]);
    }

    public function store(StoreInvoiceRequest $request)
    {
        $this->invoiceService->createInvoice($request->validated());
        return redirect()->route('history')->with('success', 'Invoice created successfully.');
    }

    public function show(Invoice $invoice)
    {
        return Inertia::render('invoices/show', [
            'invoice' => $invoice->load(['client', 'items.product']),
        ]);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return redirect()->back()->with('success', 'Invoice deleted successfully.');
    }
}
