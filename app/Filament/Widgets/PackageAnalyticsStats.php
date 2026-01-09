<?php

namespace App\Filament\Widgets;

use App\Models\Package;
use App\Models\PackageView;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PackageAnalyticsStats extends BaseWidget
{
    protected static ?int $sort = null;

    protected static string $view = 'filament.widgets.package-analytics-stats';

    public ?string $filter = 'all';

    protected static ?string $pollingInterval = null;

    public static function canView(): bool
    {
        // Only show on specific pages, not on dashboard
        $currentPath = request()->path();

        // Show only on Package Analytics page
        return str_contains($currentPath, 'package-analytics');
    }

    protected function getStats(): array
    {
        // Total packages count
        $totalPackages = Package::withoutGlobalScopes()->count();

        // Get views count based on filter
        $viewsData = $this->getViewsData();

        return [
            Stat::make('Total Packages', $totalPackages)
                ->description('All packages')
                ->descriptionIcon('heroicon-m-cube')
                ->color('primary')
                ->chart([7, 12, 15, 18, 22, 24, 27]),

            Stat::make('Package Views', $viewsData['count'])
                ->description($viewsData['description'])
                ->descriptionIcon($viewsData['icon'])
                ->color($viewsData['color'])
                ->chart($viewsData['chart']),
        ];
    }

    protected function getViewsData(): array
    {
        $filter = $this->filter ?? 'all';
        $now = Carbon::now();

        $query = PackageView::query();
        $description = 'All time';
        $icon = 'heroicon-m-eye';
        $color = 'success';

        switch ($filter) {
            case 'today':
                $startDate = $now->copy()->startOfDay();
                $endDate = $now->copy()->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
                $description = 'Today';
                $chartData = $this->getHourlyChart($startDate, $endDate);
                break;

            case 'yesterday':
                $startDate = $now->copy()->subDay()->startOfDay();
                $endDate = $now->copy()->subDay()->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
                $description = 'Yesterday';
                $chartData = $this->getHourlyChart($startDate, $endDate);
                break;

            case '7days':
                $startDate = $now->copy()->subDays(6)->startOfDay();
                $endDate = $now->copy()->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
                $description = 'Last 7 days';
                $chartData = $this->getDailyChart($startDate, $endDate);
                break;

            case 'month':
                $startDate = $now->copy()->subMonth()->startOfDay();
                $endDate = $now->copy()->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
                $description = 'Last month';
                $chartData = $this->getDailyChart($startDate, $endDate);
                break;

            case 'year':
                $startDate = $now->copy()->subYear()->startOfDay();
                $endDate = $now->copy()->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
                $description = 'Last year';
                $chartData = $this->getMonthlyChart($startDate, $endDate);
                break;

            default: // 'all'
                $description = 'All time';
                // Get the last 12 months for chart
                $startDate = $now->copy()->subMonths(11)->startOfMonth();
                $endDate = $now->copy()->endOfMonth();
                $chartData = $this->getMonthlyChartForAllTime($startDate, $endDate);
                break;
        }

        $count = $query->count();

        return [
            'count' => number_format($count),
            'description' => $description,
            'icon' => $icon,
            'color' => $color,
            'chart' => $chartData ?? [0],
        ];
    }

    protected function getHourlyChart(Carbon $start, Carbon $end): array
    {
        $driver = config('database.default');
        $connection = config("database.connections.{$driver}.driver");

        if ($connection === 'pgsql') {
            $dateExpression = "TO_CHAR(created_at, 'YYYY-MM-DD HH24:00:00')";
        } else {
            $dateExpression = "DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00')";
        }

        $data = PackageView::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw("{$dateExpression} as hour, COUNT(*) as count")
            ->groupBy('hour')
            ->orderBy('hour')
            ->pluck('count')
            ->toArray();

        return array_slice(array_pad($data, 24, 0), -24);
    }

    protected function getDailyChart(Carbon $start, Carbon $end): array
    {
        $driver = config('database.default');
        $connection = config("database.connections.{$driver}.driver");

        if ($connection === 'pgsql') {
            $dateExpression = "TO_CHAR(created_at, 'YYYY-MM-DD')";
        } else {
            $dateExpression = "DATE_FORMAT(created_at, '%Y-%m-%d')";
        }

        $data = PackageView::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw("{$dateExpression} as date, COUNT(*) as count")
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count')
            ->toArray();

        $days = $start->diffInDays($end) + 1;

        return array_slice(array_pad($data, $days, 0), -$days);
    }

    protected function getMonthlyChart(Carbon $start, Carbon $end): array
    {
        $driver = config('database.default');
        $connection = config("database.connections.{$driver}.driver");

        if ($connection === 'pgsql') {
            $dateExpression = "TO_CHAR(created_at, 'YYYY-MM')";
        } else {
            $dateExpression = "DATE_FORMAT(created_at, '%Y-%m')";
        }

        $data = PackageView::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw("{$dateExpression} as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count')
            ->toArray();

        return array_slice(array_pad($data, 12, 0), -12);
    }

    protected function getMonthlyChartForAllTime(Carbon $start, Carbon $end): array
    {
        $driver = config('database.default');
        $connection = config("database.connections.{$driver}.driver");

        if ($connection === 'pgsql') {
            $dateExpression = "TO_CHAR(created_at, 'YYYY-MM')";
        } else {
            $dateExpression = "DATE_FORMAT(created_at, '%Y-%m')";
        }

        $data = PackageView::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw("{$dateExpression} as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count')
            ->toArray();

        return array_pad($data, 12, 0);
    }
}
