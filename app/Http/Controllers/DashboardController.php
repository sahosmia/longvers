<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Client;
use Illuminate\Support\Facades\DB;
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

        // Daily revenue for the last 7 days
        $daily_revenue = Invoice::select(
                DB::raw("strftime('%m-%d', date) as day"),
                DB::raw("SUM(total) as revenue"),
                DB::raw("SUM(paid) as paid"),
                DB::raw("SUM(due) as due")
            )
            ->groupBy('day')
            ->orderBy('day', 'asc')
            ->limit(7)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'top_clients' => Client::orderBy('total_paid', 'desc')->take(5)->get(),
            'daily_revenue' => $daily_revenue,
        ]);
    }
}
