<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class SeoSettings extends Settings
{
    public ?string $title;

    public ?string $description;

    public ?string $keywords;

    public ?string $og_title;

    public ?string $og_description;

    public ?string $og_url;

    public ?string $og_type = 'website';

    public ?string $twitter_title;

    public ?string $twitter_description;

    public static function group(): string
    {
        return 'seo';
    }
}
