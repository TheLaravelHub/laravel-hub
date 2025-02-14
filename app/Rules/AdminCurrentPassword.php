<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminCurrentPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Get the currently authenticated admin
        $admin = Auth::admin();

        // Check if the provided password matches the admin's current password
        if (! $admin || ! Hash::check($value, $admin->password)) {
            $fail(__('The current password is incorrect.'));
        }
    }
}
