<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Client;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_orders' => Invoice::count(),
            'total_revenue' => Invoice::sum('total'),
            'total_paid' => Invoice::sum('paid'),
            'total_due' => Invoice::sum('due'),
            'pending' => Invoice::where('status', 'Processing')->count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'top_clients' => Client::orderBy('total_paid', 'desc')->take(5)->get(),
        ]);
    }
}
