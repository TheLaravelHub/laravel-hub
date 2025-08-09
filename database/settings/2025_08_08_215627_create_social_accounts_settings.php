<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('social-accounts.github', null);
        $this->migrator->add('social-accounts.x', null);
        $this->migrator->add('social-accounts.facebook', null);
        $this->migrator->add('social-accounts.telegram', null);
        $this->migrator->add('social-accounts.bluesky', null);
        $this->migrator->add('social-accounts.linkedin', null);
    }
};
