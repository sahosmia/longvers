<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class CategorySlugTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_category_slug_is_generated_automatically_if_not_provided()
    {
        $response = $this->actingAs($this->user)->post(route('categories.store'), [
            'name' => 'New Category',
            'slug' => '',
            'description' => 'Test description',
        ]);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'name' => 'New Category',
            'slug' => 'new-category',
        ]);
    }

    public function test_category_slug_can_be_provided_manually()
    {
        $response = $this->actingAs($this->user)->post(route('categories.store'), [
            'name' => 'Custom Category',
            'slug' => 'custom-slug',
            'description' => 'Test description',
        ]);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'name' => 'Custom Category',
            'slug' => 'custom-slug',
        ]);
    }

    public function test_category_slug_is_regenerated_on_update_if_empty()
    {
        $category = Category::create([
            'name' => 'Old Name',
            'slug' => 'old-name',
        ]);

        $response = $this->actingAs($this->user)->put(route('categories.update', $category), [
            'name' => 'Updated Name',
            'slug' => '',
            'description' => 'Updated description',
        ]);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Name',
            'slug' => 'updated-name',
        ]);
    }
}
