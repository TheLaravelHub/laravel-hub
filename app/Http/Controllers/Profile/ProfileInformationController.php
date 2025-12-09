<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileInformationController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('User/Profile/Information', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'activeTab' => 'information',
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->forceFill([
                'email_verified_at' => null,
            ]);
        }

        $request->user()->save();

        return Redirect::route('app.user.profile.information.edit')
            ->with('status', 'profile-updated');
    }
}
