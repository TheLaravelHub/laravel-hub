<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Str;
use Thefeqy\ModelStatus\Enums\Status;

final class UpdateIndexRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'slug' => ['required', 'string', 'max:255', 'unique:indexes,slug,'.$this->route('index')->id],
            'icon' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'color_code' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:'.implode(',', array_column(Status::cases(), 'value'))],
        ];
    }

    /**
     * Slugify name in slug column before validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->name),
            'status' => $this->active ? Status::ACTIVE->value : Status::INACTIVE->value,
        ]);
    }
}
