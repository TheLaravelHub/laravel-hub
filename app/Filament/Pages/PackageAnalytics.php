<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\PackageAnalyticsStats;
use App\Filament\Widgets\PackageViewsChart;
use Filament\Pages\Page;

class PackageAnalytics extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static string $view = 'filament.pages.package-analytics';

    protected static ?string $navigationGroup = 'Packages';

    protected static ?int $navigationSort = 3;

    protected static ?string $title = 'Package Analytics';

    protected static ?string $navigationLabel = 'Analytics';

    protected function getHeaderWidgets(): array
    {
        return [
            PackageAnalyticsStats::class,
            PackageViewsChart::class,
        ];
    }
}
