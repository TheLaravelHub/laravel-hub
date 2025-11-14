<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\BlogAnalyticsStats;
use App\Filament\Widgets\BlogViewsChart;
use Filament\Pages\Page;

class Analytics extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static string $view = 'filament.pages.analytics';

    protected static ?string $navigationGroup = 'Blog';

    protected static ?int $navigationSort = 3;

    protected static ?string $title = 'Blog Analytics';

    protected static ?string $navigationLabel = 'Analytics';

    public function getWidgets(): array
    {
        return [
            BlogAnalyticsStats::class,
            BlogViewsChart::class,
        ];
    }

    public function getVisibleWidgets(): array
    {
        return $this->filterVisibleWidgets($this->getWidgets());
    }

    public function getHeaderWidgetsColumns(): int|array
    {
        return 1;
    }
}
