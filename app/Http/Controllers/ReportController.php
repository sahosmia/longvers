<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // Monthly Revenue, Paid, Due, Cost (Calculated as 40% of revenue for demo)
        $monthlyStats = \App\Models\Invoice::selectRaw("
                DATE_FORMAT(date, '%b') as month,
                SUM(total) as revenue,
                SUM(paid) as paid,
                SUM(due) as due,
                SUM(total) * 0.4 as cost
            ")
            ->groupBy('month')
            ->orderBy('date')
            ->get();

        // Revenue by Category
        $categorySplit = \App\Models\Category::with(['products.invoiceItems' => function($query) {
                $query->select('product_id', 'qty', 'price');
            }])->get()->map(function($category) {
                $value = $category->products->flatMap->invoiceItems->sum(function($item) {
                    return $item->qty * $item->price;
                });
                return [
                    'name' => $category->name,
                    'value' => (float)$value
                ];
            })->values();

        // Colors for categories
        $colors = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"];
        foreach ($categorySplit as $index => &$item) {
            $item['fill'] = $colors[$index % count($colors)];
        }

        return Inertia::render('reports', [
            'monthlyData' => $monthlyStats,
            'categorySplit' => $categorySplit,
            'totalServices' => \App\Models\InvoiceItem::sum('qty'),
        ]);
    }
}
