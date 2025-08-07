<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('seo.title', env('APP_NAME'));
        $this->migrator->add('seo.description', null);
        $this->migrator->add('seo.keywords', null);
        $this->migrator->add('seo.og_title', null);
        $this->migrator->add('seo.og_description', null);
        $this->migrator->add('seo.og_url', null);
        $this->migrator->add('seo.og_type', 'website');
        $this->migrator->add('seo.twitter_title', null);
        $this->migrator->add('seo.twitter_description', null);
    }
};
