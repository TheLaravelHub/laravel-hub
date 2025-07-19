<?php

namespace App\Actions;

use App\Models\User;
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
            $user = User::query()
                ->create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'email_verified_at' => now(),
                    'provider_type' => $provider,
                    'provider_id' => $provider === 'github' ? $socialUser->getId() : null,
                    'provider_token' => $provider === 'github' ? $socialUser->token : null,
                    'provider_refresh_token' => $provider === 'github' ? $socialUser->refreshToken : null,
                    'avatar' => $provider === 'github' ? $socialUser->getAvatar() : null,
                ]);
        } else {
            $user->update([
                'provider_type' => $provider,
                'provider_id' => $provider === 'github' ? $socialUser->getId() : null,
                'provider_token' => $provider === 'github' ? $socialUser->token : null,
                'provider_refresh_token' => $provider === 'github' ? $socialUser->refreshToken : null,
                'avatar' => $provider === 'github' ? $socialUser->getAvatar() : null,
            ]);
        }

        return $user;
    }
}
