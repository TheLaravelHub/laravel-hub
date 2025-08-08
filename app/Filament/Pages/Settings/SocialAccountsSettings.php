<?php

namespace App\Filament\Pages\Settings;

use App\Filament\Pages\ManageSettings;
use App\Settings\SocialAccountsSettings as SocialAccountsSettingsData;
use AymanAlhattami\FilamentPageWithSidebar\Traits\HasPageSidebar;
use Filament\Forms;
use Filament\Pages\SettingsPage;

class SocialAccountsSettings extends SettingsPage
{
    use HasPageSidebar;

    protected static ?string $navigationIcon = null;

    protected static ?string $navigationGroup = null;

    protected static bool $shouldRegisterNavigation = false;

    protected static string $settings = SocialAccountsSettingsData::class;

    public static function sidebar(): \AymanAlhattami\FilamentPageWithSidebar\FilamentPageSidebar
    {
        return ManageSettings::sidebar();
    }

    protected function getFormSchema(): array
    {
        return [
            Forms\Components\Section::make('Social Accounts')
                ->schema([
                    Forms\Components\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('github'),
                        Forms\Components\TextInput::make('x'),
                        Forms\Components\TextInput::make('facebook'),
                        Forms\Components\TextInput::make('telegram'),
                        Forms\Components\TextInput::make('bluesky'),
                        Forms\Components\TextInput::make('linkedin'),
                    ]),
                ]),
        ];
    }
}
