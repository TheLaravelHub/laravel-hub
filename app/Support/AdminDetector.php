<?php

namespace App\Support;

use Illuminate\Support\Facades\Auth;

final class AdminDetector
{
    public static function check(): bool
    {
        return Auth::check() && (bool) (Auth::user()->is_admin ?? false);
    }
}
