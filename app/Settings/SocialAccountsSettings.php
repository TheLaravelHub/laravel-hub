<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class SocialAccountsSettings extends Settings
{
    public ?string $github;

    public ?string $x;

    public ?string $facebook;

    public ?string $telegram;

    public ?string $bluesky;

    public ?string $linkedin;

    public static function group(): string
    {
        return 'social-accounts';
    }
}
