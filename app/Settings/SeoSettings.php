<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class SeoSettings extends Settings
{
    public ?string $title;

    public ?string $description;

    public ?string $keywords;

    public ?string $og_type = 'website';

    public ?string $og_title;

    public ?string $og_description;

    public ?string $og_image;

    public ?string $og_url;

    public ?string $og_site_name;

    public ?string $og_locale = 'en_US';

    public ?string $twitter_card = 'summary_large_image';

    public ?string $twitter_site;

    public ?string $twitter_title;

    public ?string $twitter_description;

    public ?string $twitter_image;

    public static function group(): string
    {
        return 'seo';
    }
}
