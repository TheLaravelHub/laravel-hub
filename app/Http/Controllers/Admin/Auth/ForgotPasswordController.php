<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

final class ForgotPasswordController extends Controller
{
    // Show the forgot password form
    public function showLinkRequestForm()
    {
        return inertia('Admin/Auth/ForgotPassword'); // Adjust the view path based on your Inertia setup
    }

    // Handle password reset link
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::broker('admins')->sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    }
}
