<?php

namespace App\Http\Requests\Application\Feed;

use Illuminate\Foundation\Http\FormRequest;

class ToggleVoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'vote_type' => 'required|in:upvote,downvote',
        ];
    }
}
