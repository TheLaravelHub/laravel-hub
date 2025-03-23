<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Str;
use Thefeqy\ModelStatus\Status;

final class CreateCategoryRequest extends FormRequest
{
    private string $categoryType;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->where(fn ($query) => $query->where('category_type', $this->categoryType)),
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->where(fn ($query) => $query->where('category_type', $this->categoryType)),
            ],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:'.Status::active().','.Status::inactive()],
        ];
    }

    /**
     * Retrieve category type.
     */
    public function getCategoryType(): string
    {
        return $this->categoryType;
    }

    /**
     * Slugify name in slug column before validation.
     */
    protected function prepareForValidation(): void
    {
        // TODO: Add actual class names after creating models
        // Determine category type based on route name
        $this->categoryType = $this->routeIs('admin.packages.categories.*')
            ? 'App\Models\Package'
            : 'App\Models\BlogPost';

        $this->merge([
            'slug' => Str::slug($this->name),
            'status' => $this->active ? Status::active() : Status::inactive(),
        ]);
    }
}
