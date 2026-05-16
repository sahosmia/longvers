<?php

use App\Models\User;
use App\Models\Invoice;
use App\Models\Outlet;
use App\Models\Client;
use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->outlet = Outlet::create(['name' => 'Main Outlet']);
    $this->category = Category::create(['name' => 'Services', 'slug' => 'services']);
    $this->unit = Unit::create(['name' => 'pcs', 'short_name' => 'pcs']);
    $this->product = Product::create([
        'name' => 'Test Product',
        'price' => 100,
        'stock' => 50,
        'category_id' => $this->category->id,
        'unit_id' => $this->unit->id,
    ]);
    $this->client = Client::create(['name' => 'John Doe', 'phone' => '123456789']);
});

test('invoice can be updated successfully with a unique invoice_uuid', function () {
    $invoice = Invoice::create([
        'invoice_uuid' => 'INV-OLD-123',
        'outlet_id' => $this->outlet->id,
        'date' => now()->toDateString(),
        'client_id' => $this->client->id,
        'total' => 100,
        'paid' => 100,
        'due' => 0,
        'status' => 'Processing',
        'method' => 'Cash',
    ]);

    $response = $this->actingAs($this->user)->put(route('invoices.update', $invoice->id), [
        'invoice_uuid' => 'INV-NEW-456',
        'outlet_id' => $this->outlet->id,
        'date' => now()->toDateString(),
        'client_id' => $this->client->id,
        'total' => 200,
        'paid' => 150,
        'due' => 50,
        'status' => 'Delivered',
        'method' => 'Bank',
        'items' => [
            ['productId' => $this->product->id, 'qty' => 2, 'price' => 100]
        ]
    ]);

    $response->assertRedirect(route('history'));
    $this->assertDatabaseHas('invoices', [
        'id' => $invoice->id,
        'invoice_uuid' => 'INV-NEW-456',
        'total' => 200,
        'status' => 'Delivered',
    ]);
});

test('update fails if the modified invoice_uuid conflicts with an existing record', function () {
    Invoice::create([
        'invoice_uuid' => 'INV-CONFLICT',
        'outlet_id' => $this->outlet->id,
        'date' => now()->toDateString(),
        'client_id' => $this->client->id,
        'total' => 100,
        'paid' => 100,
        'due' => 0,
        'status' => 'Processing',
        'method' => 'Cash',
    ]);

    $invoice = Invoice::create([
        'invoice_uuid' => 'INV-ORIGINAL',
        'outlet_id' => $this->outlet->id,
        'date' => now()->toDateString(),
        'client_id' => $this->client->id,
        'total' => 100,
        'paid' => 100,
        'due' => 0,
        'status' => 'Processing',
        'method' => 'Cash',
    ]);

    $response = $this->actingAs($this->user)->put(route('invoices.update', $invoice->id), [
        'invoice_uuid' => 'INV-CONFLICT',
        'outlet_id' => $this->outlet->id,
        'date' => now()->toDateString(),
        'client_id' => $this->client->id,
        'total' => 200,
        'paid' => 200,
        'due' => 0,
        'status' => 'Processing',
        'method' => 'Cash',
        'items' => [
            ['productId' => $this->product->id, 'qty' => 2, 'price' => 100]
        ]
    ]);

    $response->assertSessionHasErrors(['invoice_uuid']);
});

test('validation allows saving if the invoice_uuid remains unchanged during an edit', function () {
    $invoice = Invoice::create([
        'invoice_uuid' => 'INV-STAY-SAME',
        'outlet_id' => $this->outlet->id,
        'date' => now()->toDateString(),
        'client_id' => $this->client->id,
        'total' => 100,
        'paid' => 100,
        'due' => 0,
        'status' => 'Processing',
        'method' => 'Cash',
    ]);

    $response = $this->actingAs($this->user)->put(route('invoices.update', $invoice->id), [
        'invoice_uuid' => 'INV-STAY-SAME',
        'outlet_id' => $this->outlet->id,
        'date' => now()->toDateString(),
        'client_id' => $this->client->id,
        'total' => 200,
        'paid' => 200,
        'due' => 0,
        'status' => 'Processing',
        'method' => 'Cash',
        'items' => [
            ['productId' => $this->product->id, 'qty' => 2, 'price' => 100]
        ]
    ]);

    $response->assertRedirect(route('history'));
    $this->assertDatabaseHas('invoices', [
        'id' => $invoice->id,
        'invoice_uuid' => 'INV-STAY-SAME',
    ]);
});
