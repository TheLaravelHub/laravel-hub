<?php

namespace App\Http\Requests;

use Coderflex\LaravelTurnstile\Rules\TurnstileCheck;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreatePackageSubmissionRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'repository_url' => [
                'required',
                'url',
                'string',
                'max:255',
                'regex:/^https:\/\/github\.com\/[^\/]+\/[^\/]+$/i',
                Rule::unique('package_submissions', 'repository_url'),
                Rule::unique('packages', 'repository_url'),
            ],
            'cf_turnstile_response' => ['required', new TurnstileCheck],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'repository_url' => 'GitHub repository URL',
            'cf_turnstile_response' => 'CAPTCHA',
        ];
    }
}
