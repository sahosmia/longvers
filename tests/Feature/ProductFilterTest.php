<?php

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it can filter low stock products', function () {
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Test', 'slug' => 'test']);

    Product::create(['name' => 'Normal', 'category_id' => $category->id, 'price' => 10, 'stock' => 20]);
    Product::create(['name' => 'Low', 'category_id' => $category->id, 'price' => 10, 'stock' => 5]);
    Product::create(['name' => 'Out', 'category_id' => $category->id, 'price' => 10, 'stock' => 0]);

    $response = $this->actingAs($user)->get('/products?filter=low_stock');

    $response->assertInertia(fn (Assert $page) => $page
        ->has('products', 1)
        ->where('products.0.name', 'Low')
    );
});

test('it can filter out of stock products', function () {
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Test', 'slug' => 'test']);

    Product::create(['name' => 'Normal', 'category_id' => $category->id, 'price' => 10, 'stock' => 20]);
    Product::create(['name' => 'Low', 'category_id' => $category->id, 'price' => 10, 'stock' => 5]);
    Product::create(['name' => 'Out', 'category_id' => $category->id, 'price' => 10, 'stock' => 0]);

    $response = $this->actingAs($user)->get('/products?filter=out_of_stock');

    $response->assertInertia(fn (Assert $page) => $page
        ->has('products', 1)
        ->where('products.0.name', 'Out')
    );
});
