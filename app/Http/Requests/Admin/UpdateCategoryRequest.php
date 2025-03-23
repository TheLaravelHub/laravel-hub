<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Str;
use Thefeqy\ModelStatus\Status;

final class UpdateCategoryRequest extends FormRequest
{
    private string $categoryType;

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $categoryId = $this->route('category')->id; // Get the current category's ID

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')
                    ->ignore($categoryId) // Ignore the current category
                    ->where(fn ($query) => $query->where('category_type', $this->categoryType)),
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')
                    ->ignore($categoryId) // Ignore the current category
                    ->where(fn ($query) => $query->where('category_type', $this->categoryType)),
            ],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:'.Status::active().','.Status::inactive()],
        ];
    }

    public function prepareForValidation(): void
    {
        // Determine category type automatically from route
        $this->categoryType = $this->routeIs('admin.packages.categories.*')
            ? 'App\Models\Package'
            : 'App\Models\BlogPost';

        $this->merge([
            'slug' => Str::slug($this->name),
            'status' => $this->active ? Status::active() : Status::inactive(),
        ]);
    }

    /**
     * Retrieve category type.
     */
    public function getCategoryType(): string
    {
        return $this->categoryType;
    }
}
