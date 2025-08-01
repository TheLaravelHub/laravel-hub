<?php

namespace App\Actions;

use App\Models\User;
use App\Services\UserService;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class CreateOrUpdateSocialUserAction
{
    /**
     * Create or update a user from social provider data.
     */
    public function handle(string $provider, SocialiteUser $socialUser): User
    {
        $user = User::query()
            ->where('email', $socialUser->getEmail())->first();

        if (! $user) {
            $name = $socialUser->getName();
            if (! $name) {
                $name = (new GenerateRandomNameAction)->handle();
            }

            $username = (new UserService)->generateUsername($name);
            $user = User::query()
                ->create([
                    'name' => $name,
                    'email' => $socialUser->getEmail(),
                    'username' => $username,
                    'email_verified_at' => now(),
                    'provider_type' => $provider,
                    'provider_id' => $provider === 'github' ? $socialUser->getId() : null,
                    'provider_token' => $provider === 'github' ? $socialUser->token ?? null : null,
                    'provider_refresh_token' => $provider === 'github' ? $socialUser->refreshToken ?? null : null,
                    'avatar' => $provider === 'github' ? $socialUser->getAvatar() : null,
                ]);
        } else {
            $user->update([
                'provider_type' => $provider,
                'provider_id' => $provider === 'github' ? $socialUser->getId() : null,
                'provider_token' => $provider === 'github' ? $socialUser->token ?? null : null,
                'provider_refresh_token' => $provider === 'github' ? $socialUser->refreshToken ?? null : null,
                'avatar' => $provider === 'github' ? $socialUser->getAvatar() : null,
            ]);
        }

        return $user;
    }
}
