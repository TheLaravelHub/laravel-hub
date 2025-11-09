<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('seo.og_image', null);
        $this->migrator->add('seo.og_site_name', 'Laravel Hub');
        $this->migrator->add('seo.og_locale', 'en_US');
        $this->migrator->add('seo.twitter_card', 'summary_large_image');
        $this->migrator->add('seo.twitter_site', '@thelaravelhub');
        $this->migrator->add('seo.twitter_image', null);
    }
};
