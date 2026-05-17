<?php

use App\Models\User;
use App\Models\Client;
use App\Models\Product;
use App\Models\Category;

test('invoice can be stored with existing client', function () {
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Test Category', 'slug' => 'test-category']);
    $product = Product::create([
        'name' => 'Test Product',
        'category_id' => $category->id,
        'price' => 100,
    ]);
    $client = Client::create([
        'name' => 'Existing Client',
        'phone' => '01700000000',
        'address' => 'Test Address'
    ]);

    $data = [
        'id' => 'INV-' . time(),
        'date' => now()->format('Y-m-d'),
        'client_id' => $client->id,
        'create_new_client' => false,
        'total' => 100,
        'paid' => 100,
        'due' => 0,
        'status' => 'Processing',
        'method' => 'Cash',
        'items' => [
            [
                'productId' => $product->id,
                'qty' => 1,
                'price' => 100
            ]
        ]
    ];

    $response = $this->actingAs($user)->post(route('invoices.store'), $data);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('history'));
});

test('invoice cannot be stored with empty client id when create_new_client is false', function () {
    $user = User::factory()->create();

    $data = [
        'id' => 'INV-' . time(),
        'date' => now()->format('Y-m-d'),
        'client_id' => '',
        'create_new_client' => false,
        'total' => 100,
        'paid' => 100,
        'due' => 0,
        'status' => 'Processing',
        'method' => 'Cash',
        'items' => [
            ['productId' => 1, 'qty' => 1, 'price' => 100]
        ]
    ];

    $response = $this->actingAs($user)->post(route('invoices.store'), $data);

    $response->assertSessionHasErrors(['client_id']);
});

test('invoice can be stored with new client', function () {
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Test Category', 'slug' => 'test-category']);
    $product = Product::create([
        'name' => 'Test Product',
        'category_id' => $category->id,
        'price' => 100,
    ]);

    $data = [
        'id' => 'INV-' . (time() + 1),
        'date' => now()->format('Y-m-d'),
        'client_id' => '',
        'create_new_client' => true,
        'new_client_name' => 'New Client',
        'new_client_phone' => '01800000000',
        'new_client_address' => 'New Address',
        'total' => 100,
        'paid' => 100,
        'due' => 0,
        'status' => 'Processing',
        'method' => 'Cash',
        'items' => [
            [
                'productId' => $product->id,
                'qty' => 1,
                'price' => 100
            ]
        ]
    ];

    $response = $this->actingAs($user)->post(route('invoices.store'), $data);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('history'));
});
