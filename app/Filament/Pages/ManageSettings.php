<?php

namespace App\Filament\Pages;

use App\Filament\Pages\Settings\GeneralSettings;
use App\Filament\Pages\Settings\SeoSettings;
use App\Filament\Pages\Settings\SocialAccountsSettings;
use AymanAlhattami\FilamentPageWithSidebar\FilamentPageSidebar;
use AymanAlhattami\FilamentPageWithSidebar\PageNavigationItem;
use AymanAlhattami\FilamentPageWithSidebar\Traits\HasPageSidebar;
use Filament\Pages\Page;

class ManageSettings extends Page
{
    use HasPageSidebar;

    protected static ?string $navigationIcon = 'heroicon-o-cog';

    public function mount()
    {
        return redirect()->to(GeneralSettings::getUrl());
    }

    public static function sidebar(): FilamentPageSidebar
    {
        return FilamentPageSidebar::make()
            ->setTitle('Settings')
            ->setNavigationItems([
                PageNavigationItem::make('General')
                    ->url(fn () => GeneralSettings::getUrl())
                    ->icon('heroicon-o-cog'),
                PageNavigationItem::make('SEO')
                    ->url(fn () => SeoSettings::getUrl())
                    ->icon('heroicon-o-presentation-chart-bar'),
                PageNavigationItem::make('Social Accounts')
                    ->url(fn () => SocialAccountsSettings::getUrl())
                    ->icon('heroicon-o-at-symbol'),
            ]);
    }
}
