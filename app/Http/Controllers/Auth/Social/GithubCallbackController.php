<?php

namespace App\Http\Controllers\Auth\Social;

use App\Actions\CreateOrUpdateSocialUserAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GithubCallbackController extends Controller
{
    public function __invoke(CreateOrUpdateSocialUserAction $action): RedirectResponse
    {
        $githubUser = Socialite::driver('github')->user();

        $user = $action->handle('github', $githubUser);

        Auth::login($user);

        return redirect()
            ->route('dashboard');
    }
}
