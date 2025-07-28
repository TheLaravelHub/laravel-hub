<?php

namespace App\Actions;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class SendPasswordResetLinkAction
{
    public function execute(Request $request): void
    {
        $email = $request->input('email');
        $rateLimiterKey = 'password-reset|' . $email;
        $cacheKey = 'password_reset_attempts:' . sha1($email);

        if (RateLimiter::tooManyAttempts($rateLimiterKey, 1)) {
            throw ValidationException::withMessages([
                'email' => ['Please wait before retrying.'],
            ]);
        }

        RateLimiter::hit($rateLimiterKey);

        Cache::increment($cacheKey);
        Cache::put($cacheKey, Cache::get($cacheKey), now()->addMinutes(30));

        $request->validate([
            'email' => 'required|email',
        ]);

        Password::sendResetLink(
            $request->only('email')
        );
    }
}
