<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'nullable|exists:units,id',
            'image' => 'nullable|image|max:2048',
            'price' => 'required|numeric|min:0',
             'outlet_prices' => 'nullable|array',
            'outlet_prices.*.outlet_id' => 'required|exists:outlets,id',
            'outlet_prices.*.price' => 'required|numeric|min:0',
        ];
    }
}
