<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\SecurityUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileSecurityController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('User/Profile/Security', [
            'status' => session('status'),
            'activeTab' => 'security',
        ]);
    }

    public function update(SecurityUpdateRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => $request->get('password'),
        ]);

        return Redirect::back()
            ->with('status', 'password-updated');
    }
}
