<?php

namespace App\Http\Requests\Admin;

use App\Models\Package;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreatePackageRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'repository_url' => ['required', 'url', 'regex:/github\.com\/([^\/]+)\/([^\/]+)/', 'unique:packages,repository_url'],
            'index_id' => ['required', 'integer', 'exists:indexes,id'],
            'category_ids' => ['required', 'array'],
            'category_ids.*' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')
                    ->where(function ($query) {
                        $query->where('category_type', Package::class);
                    }),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'language' => ['required', 'string', 'max:255'],
            'stars' => ['required', 'integer'],
            'owner' => ['required', 'string', 'max:255'],
            'owner_avatar' => ['required', 'url'],
        ];
    }
}
