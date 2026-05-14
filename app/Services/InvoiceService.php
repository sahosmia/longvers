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
            $clientId = $data['client_id'];

            if (!empty($data['create_new_client'])) {
                $client = Client::create([
                    'name' => $data['new_client_name'],
                    'email' => $data['new_client_email'],
                    'phone' => $data['new_client_phone'],
                    'address' => $data['new_client_address'] ?? null,
                ]);
                $clientId = $client->id;
            }

            $invoice = Invoice::create([
                'id' => $data['id'],
                'date' => $data['date'],
                'client_id' => $clientId,
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
            $client = Client::find($clientId);
            $client->increment('total_orders');
            $client->increment('total_paid', $data['paid']);
            $client->increment('total_due', $data['due']);

            return $invoice;
        });
    }
}
