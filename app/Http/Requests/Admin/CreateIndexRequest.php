<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Str;
use Thefeqy\ModelStatus\Enums\Status;

class CreateIndexRequest extends FormRequest
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
            'slug' => ['required', 'string', 'max:255', 'unique:indexes,slug'],
            'icon' => ['required', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
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
