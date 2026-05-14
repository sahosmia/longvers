<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Category;
use App\Models\InvoiceItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Gents', 'Ladies', 'Kids', 'Household', 'Others'];
        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat] = Category::create([
                'name' => $cat,
                'slug' => strtolower($cat),
                'description' => $cat . ' category',
            ]);
        }

        $productsData = [
            ['name' => 'Cotton Shirt', 'category' => 'Gents', 'price' => 25, 'stock' => 100],
            ['name' => 'Jeans Pant', 'category' => 'Gents', 'price' => 35, 'stock' => 80],
            ['name' => 'Silk Panjabi', 'category' => 'Gents', 'price' => 50, 'stock' => 60],
            ['name' => 'Salwar Kameez', 'category' => 'Ladies', 'price' => 45, 'stock' => 90],
            ['name' => 'Silk Saree', 'category' => 'Ladies', 'price' => 120, 'stock' => 40],
            ['name' => 'Chiffon Orna', 'category' => 'Ladies', 'price' => 15, 'stock' => 120],
            ['name' => 'Kids T-Shirt', 'category' => 'Kids', 'price' => 12, 'stock' => 2],
            ['name' => 'Kids Frock', 'category' => 'Kids', 'price' => 20, 'stock' => 100],
            ['name' => 'Bed Sheet', 'category' => 'Household', 'price' => 40, 'stock' => 0],
            ['name' => 'Curtain Pair', 'category' => 'Household', 'price' => 60, 'stock' => 60],
            ['name' => 'Blanket Wash', 'category' => 'Household', 'price' => 150, 'stock' => 30],
            ['name' => 'Backpack', 'category' => 'Others', 'price' => 80, 'stock' => 50],
        ];

        $productModels = [];
        foreach ($productsData as $p) {
            $productModels[] = Product::create([
                'name' => $p['name'],
                'category_id' => $categoryModels[$p['category']]->id,
                'price' => $p['price'],
                'stock' => $p['stock'],
            ]);
        }

        $clientsData = [
            ['name' => 'Ahmed Khan', 'phone' => '01711223344', 'address' => 'Banani, Dhaka'],
            ['name' => 'Sultana Razia', 'phone' => '01822334455', 'address' => 'Dhanmondi, Dhaka'],
            ['name' => 'Tanvir Islam', 'phone' => '01933445566', 'address' => 'Uttara, Dhaka'],
            ['name' => 'Maliha Akter', 'phone' => '01644556677', 'address' => 'Mirpur, Dhaka'],
        ];

        $clientModels = [];
        foreach ($clientsData as $c) {
            $clientModels[] = Client::create($c);
        }

        // Generate some realistic invoices
        foreach ($clientModels as $client) {
            $numInvoices = rand(2, 5);
            for ($i = 0; $i < $numInvoices; $i++) {
                $total = 0;
                $items = [];
                $numItems = rand(1, 4);

                $invoiceId = 'INV-' . date('Ymd') . rand(1000, 9999);

                // Select random products for the invoice
                $selectedProducts = array_rand($productModels, $numItems);
                if (!is_array($selectedProducts)) $selectedProducts = [$selectedProducts];

                foreach ($selectedProducts as $pIdx) {
                    $prod = $productModels[$pIdx];
                    $qty = rand(1, 3);
                    $price = $prod->price;
                    $total += $qty * $price;
                    $items[] = [
                        'product_id' => $prod->id,
                        'qty' => $qty,
                        'price' => $price
                    ];
                }

                $paid = (rand(0, 10) > 7) ? rand($total * 0.5, $total) : $total;
                $due = $total - $paid;

                $invoice = Invoice::create([
                    'id' => $invoiceId,
                    'date' => date('Y-m-d', strtotime("-" . rand(0, 60) . " days")),
                    'client_id' => $client->id,
                    'total' => $total,
                    'paid' => $paid,
                    'due' => $due,
                    'status' => ($due > 0) ? 'Processing' : 'Delivered',
                    'method' => ['Cash', 'Bkash', 'Bank'][rand(0, 2)],
                ]);

                foreach ($items as $item) {
                    $item['invoice_id'] = $invoice->id;
                    InvoiceItem::create($item);
                }

                // Update client stats
                $client->increment('total_orders');
                $client->increment('total_paid', $paid);
                $client->increment('total_due', $due);
            }
        }
    }
}
