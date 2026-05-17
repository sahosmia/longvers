<?php

use App\Http\Controllers\Clients\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Invoices\InvoiceController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Reports\ReportController;
use App\Http\Controllers\Categories\CategoryController;
use App\Http\Controllers\UnitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
})->name('home');


Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('clients', ClientController::class);
    Route::resource('products', ProductController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('units', UnitController::class);

    Route::get('/invoices', [InvoiceController::class, 'index'])->name('history');
    Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('create-invoice');
    Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::patch('/invoices/{invoice}/status', [InvoiceController::class, 'updateStatus'])->name('invoices.update-status');
    Route::get('/invoices/{invoice}/print', [InvoiceController::class, 'print'])->name('invoices.print');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
