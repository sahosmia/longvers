<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Client;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    public function createInvoice(array $data)
    {
        return DB::transaction(function () use ($data) {
            $invoice = Invoice::create([
                'id' => $data['id'],
                'date' => $data['date'],
                'client_id' => $data['client_id'],
                'total' => $data['total'],
                'paid' => $data['paid'],
                'due' => $data['due'],
                'status' => $data['status'],
                'method' => $data['method'],
                'remarks' => $data['remarks'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $item['productId'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                ]);
            }

            // Update client stats
            $client = Client::find($data['client_id']);
            $client->increment('total_orders');
            $client->increment('total_paid', $data['paid']);
            $client->increment('total_due', $data['due']);

            return $invoice;
        });
    }
}
