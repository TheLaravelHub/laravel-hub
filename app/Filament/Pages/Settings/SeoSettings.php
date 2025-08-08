<?php

namespace App\Filament\Pages\Settings;

use App\Filament\Pages\ManageSettings;
use App\Settings\SeoSettings as SeoSettingsData;
use AymanAlhattami\FilamentPageWithSidebar\Traits\HasPageSidebar;
use Filament\Forms;
use Filament\Pages\SettingsPage;

class SeoSettings extends SettingsPage
{
    use HasPageSidebar;

    protected static ?string $navigationIcon = null;

    protected static ?string $navigationGroup = null;

    protected static bool $shouldRegisterNavigation = false;

    protected static string $settings = SeoSettingsData::class;

    public static function sidebar(): \AymanAlhattami\FilamentPageWithSidebar\FilamentPageSidebar
    {
        return ManageSettings::sidebar();
    }

    protected function getFormSchema(): array
    {
        return [
            Forms\Components\Section::make('General SEO Settings')
                ->schema([
                    Forms\Components\TextInput::make('title')
                        ->label('Page Title')
                        ->helperText('The title that appears in search engine results')
                        ->required(),
                    Forms\Components\Textarea::make('description')
                        ->label('Meta Description')
                        ->helperText('A brief description of your site for search results')
                        ->rows(3),
                    Forms\Components\Textarea::make('keywords')
                        ->label('Meta Keywords')
                        ->helperText('Comma-separated keywords related to your site content')
                        ->rows(2),
                ]),

            Forms\Components\Section::make('Open Graph Settings')
                ->description('Settings for social media sharing via Open Graph protocol')
                ->schema([
                    Forms\Components\TextInput::make('og_title')
                        ->label('OG Title')
                        ->helperText('Title that appears when shared on social media'),
                    Forms\Components\Textarea::make('og_description')
                        ->label('OG Description')
                        ->helperText('Description that appears when shared on social media')
                        ->rows(3),
                    Forms\Components\Grid::make(2)
                        ->schema([
                            Forms\Components\TextInput::make('og_url')
                                ->label('OG URL')
                                ->helperText('The canonical URL for your page'),
                            Forms\Components\TextInput::make('og_type')
                                ->label('OG Type')
                                ->default('website')
                                ->helperText('The type of content being shared'),
                        ]),
                ]),

            Forms\Components\Section::make('Twitter Card Settings')
                ->description('Settings for Twitter card appearance')
                ->schema([
                    Forms\Components\TextInput::make('twitter_title')
                        ->label('Twitter Title')
                        ->helperText('Title that appears in Twitter cards'),
                    Forms\Components\Textarea::make('twitter_description')
                        ->label('Twitter Description')
                        ->helperText('Description that appears in Twitter cards')
                        ->rows(3),
                ]),
        ];
    }
}
