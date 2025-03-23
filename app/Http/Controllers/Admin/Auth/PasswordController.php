<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Rules\AdminCurrentPassword;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

final class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', new AdminCurrentPassword],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->admin()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
