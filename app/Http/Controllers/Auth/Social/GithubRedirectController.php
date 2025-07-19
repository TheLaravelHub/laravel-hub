<?php

namespace App\Http\Controllers\Auth\Social;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Facades\Socialite;

class GithubRedirectController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        return Socialite::driver('github')->redirect();
    }
}
