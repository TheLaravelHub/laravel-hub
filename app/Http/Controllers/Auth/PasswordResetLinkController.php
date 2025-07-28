<?php

namespace App\Http\Controllers\Auth;

use App\Actions\SendPasswordResetLinkAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     */
    public function store(Request $request, SendPasswordResetLinkAction $action): RedirectResponse
    {
        $action->execute($request);

        return back()->with('status', __(Password::RESET_LINK_SENT));
    }
}
