<?php

namespace App\Filament\Pages\Settings;

use App\Filament\Pages\ManageSettings;
use App\Settings\GeneralSettings as GeneralSettingsData;
use AymanAlhattami\FilamentPageWithSidebar\Traits\HasPageSidebar;
use Filament\Forms;
use Filament\Pages\SettingsPage;

class GeneralSettings extends SettingsPage
{
    use HasPageSidebar;

    protected static ?string $navigationIcon = null;

    protected static ?string $navigationGroup = null;

    protected static bool $shouldRegisterNavigation = false;

    protected static string $settings = GeneralSettingsData::class;

    public static function sidebar(): \AymanAlhattami\FilamentPageWithSidebar\FilamentPageSidebar
    {
        return ManageSettings::sidebar();
    }

    protected function getFormSchema(): array
    {
        return [
            Forms\Components\TextInput::make('site_name')->required(),
        ];
    }
}
