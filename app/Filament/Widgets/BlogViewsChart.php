<?php

namespace App\Filament\Widgets;

use App\Models\BlogPostView;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;

class BlogViewsChart extends ChartWidget
{
    use InteractsWithPageFilters;

    protected static ?string $heading = 'Blog Views';

    protected static ?int $sort = null;

    protected int|string|array $columnSpan = 'full';

    public ?string $filter = 'week';

    protected static ?string $description = null;

    public static function canView(): bool
    {
        // Only show on specific pages, not on dashboard
        $currentPath = request()->path();

        // Show only on Analytics page
        return str_contains($currentPath, 'analytics');
    }

    protected function getData(): array
    {
        $period = $this->filter ?? 'week';

        // Define periods
        $periods = $this->getPeriodDates($period);
        $currentStart = $periods['current_start'];
        $currentEnd = $periods['current_end'];
        $previousStart = $periods['previous_start'];
        $previousEnd = $periods['previous_end'];

        // Get current period data
        $currentData = $this->getViewsForPeriod($currentStart, $currentEnd);

        // Get previous period data
        $previousData = $this->getViewsForPeriod($previousStart, $previousEnd);

        // Calculate comparison
        $currentTotal = array_sum($currentData['values']);
        $previousTotal = array_sum($previousData['values']);

        $percentageChange = $previousTotal > 0
            ? round((($currentTotal - $previousTotal) / $previousTotal) * 100, 1)
            : 0;

        // Update heading and description with comparison
        $this->updateHeadingWithComparison($currentTotal, $previousTotal, $percentageChange);

        return [
            'datasets' => [
                [
                    'label' => 'Blog Views',
                    'data' => $currentData['values'],
                    'borderColor' => '#6366f1',
                    'backgroundColor' => 'rgba(99, 102, 241, 0.1)',
                    'fill' => true,
                    'tension' => 0.4,
                    'pointBackgroundColor' => '#6366f1',
                    'pointBorderColor' => '#fff',
                    'pointHoverBackgroundColor' => '#fff',
                    'pointHoverBorderColor' => '#6366f1',
                ],
            ],
            'labels' => $currentData['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getFilters(): ?array
    {
        return [
            'today' => 'Today',
            'week' => 'This Week',
            'month' => 'This Month',
            'quarter' => 'This Quarter',
            'year' => 'This Year',
            '30days' => 'Last 30 Days',
            '90days' => 'Last 90 Days',
        ];
    }

    protected function getPeriodDates(string $period): array
    {
        $now = Carbon::now();

        return match ($period) {
            'today' => [
                'current_start' => $now->copy()->startOfDay(),
                'current_end' => $now->copy()->endOfDay(),
                'previous_start' => $now->copy()->subDay()->startOfDay(),
                'previous_end' => $now->copy()->subDay()->endOfDay(),
            ],
            'week' => [
                'current_start' => $now->copy()->startOfWeek(),
                'current_end' => $now->copy()->endOfWeek(),
                'previous_start' => $now->copy()->subWeek()->startOfWeek(),
                'previous_end' => $now->copy()->subWeek()->endOfWeek(),
            ],
            'month' => [
                'current_start' => $now->copy()->startOfMonth(),
                'current_end' => $now->copy()->endOfMonth(),
                'previous_start' => $now->copy()->subMonth()->startOfMonth(),
                'previous_end' => $now->copy()->subMonth()->endOfMonth(),
            ],
            'quarter' => [
                'current_start' => $now->copy()->startOfQuarter(),
                'current_end' => $now->copy()->endOfQuarter(),
                'previous_start' => $now->copy()->subQuarter()->startOfQuarter(),
                'previous_end' => $now->copy()->subQuarter()->endOfQuarter(),
            ],
            'year' => [
                'current_start' => $now->copy()->startOfYear(),
                'current_end' => $now->copy()->endOfYear(),
                'previous_start' => $now->copy()->subYear()->startOfYear(),
                'previous_end' => $now->copy()->subYear()->endOfYear(),
            ],
            '30days' => [
                'current_start' => $now->copy()->subDays(29)->startOfDay(),
                'current_end' => $now->copy()->endOfDay(),
                'previous_start' => $now->copy()->subDays(59)->startOfDay(),
                'previous_end' => $now->copy()->subDays(30)->endOfDay(),
            ],
            '90days' => [
                'current_start' => $now->copy()->subDays(89)->startOfDay(),
                'current_end' => $now->copy()->endOfDay(),
                'previous_start' => $now->copy()->subDays(179)->startOfDay(),
                'previous_end' => $now->copy()->subDays(90)->endOfDay(),
            ],
            default => [
                'current_start' => $now->copy()->startOfWeek(),
                'current_end' => $now->copy()->endOfWeek(),
                'previous_start' => $now->copy()->subWeek()->startOfWeek(),
                'previous_end' => $now->copy()->subWeek()->endOfWeek(),
            ],
        };
    }

    protected function getViewsForPeriod(Carbon $start, Carbon $end): array
    {
        $period = $this->filter ?? 'week';
        $labels = [];
        $values = [];

        // Determine the grouping format
        $groupFormat = $this->getGroupFormat($period);
        $labelFormat = $this->getLabelFormat($period);

        // Get all dates in the period
        $dates = $this->getDateRange($start, $end, $groupFormat);

        // Get the actual data from database with database-agnostic date formatting
        $dateExpression = $this->getDateFormatExpression($groupFormat);

        $views = BlogPostView::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw("{$dateExpression} as date, COUNT(*) as count")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('count', 'date')
            ->toArray();

        // Build the final arrays with all dates (filling missing dates with 0)
        foreach ($dates as $date) {
            $labels[] = $this->formatLabel($date, $labelFormat, $period);
            $values[] = $views[$date] ?? 0;
        }

        return [
            'labels' => $labels,
            'values' => $values,
        ];
    }

    protected function getDateFormatExpression(string $format): string
    {
        $driver = config('database.default');
        $connection = config("database.connections.{$driver}.driver");

        if ($connection === 'pgsql') {
            // PostgreSQL uses TO_CHAR
            $pgFormat = match ($format) {
                '%Y-%m-%d %H:00:00' => 'YYYY-MM-DD HH24:00:00',
                '%Y-%m-%d' => 'YYYY-MM-DD',
                '%Y-%m' => 'YYYY-MM',
                default => 'YYYY-MM-DD',
            };

            return "TO_CHAR(created_at, '{$pgFormat}')";
        } else {
            // MySQL uses DATE_FORMAT
            return "DATE_FORMAT(created_at, '{$format}')";
        }
    }

    protected function getGroupFormat(string $period): string
    {
        return match ($period) {
            'today' => '%Y-%m-%d %H:00:00',
            'week', 'month', '30days' => '%Y-%m-%d',
            'quarter', '90days' => '%Y-%m-%d',
            'year' => '%Y-%m',
            default => '%Y-%m-%d',
        };
    }

    protected function getLabelFormat(string $period): string
    {
        return match ($period) {
            'today' => 'H:00',
            'week' => 'D',
            'month', '30days', '90days' => 'M j',
            'quarter' => 'M j',
            'year' => 'M Y',
            default => 'M j',
        };
    }

    protected function getDateRange(Carbon $start, Carbon $end, string $groupFormat): array
    {
        $period = $this->filter ?? 'week';
        $dates = [];

        if ($period === 'today') {
            // Generate hourly intervals
            $current = $start->copy();
            while ($current <= $end) {
                $dates[] = $current->format('Y-m-d H:00:00');
                $current->addHour();
            }
        } elseif (in_array($period, ['year'])) {
            // Generate monthly intervals
            $current = $start->copy();
            while ($current <= $end) {
                $dates[] = $current->format('Y-m');
                $current->addMonth();
            }
        } else {
            // Generate daily intervals
            $current = $start->copy();
            while ($current <= $end) {
                $dates[] = $current->format('Y-m-d');
                $current->addDay();
            }
        }

        return $dates;
    }

    protected function formatLabel(string $date, string $format, string $period): string
    {
        if ($period === 'today') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $date)->format($format);
        } elseif ($period === 'year') {
            return Carbon::createFromFormat('Y-m', $date)->format($format);
        } else {
            return Carbon::createFromFormat('Y-m-d', $date)->format($format);
        }
    }

    protected function updateHeadingWithComparison(int $currentTotal, int $previousTotal, float $percentageChange): void
    {
        static::$heading = 'Blog Views';

        if ($percentageChange > 0) {
            static::$description = "📈 {$currentTotal} total views | ↑ ".abs($percentageChange)."% increase from previous period ({$previousTotal} views)";
        } elseif ($percentageChange < 0) {
            static::$description = "📉 {$currentTotal} total views | ↓ ".abs($percentageChange)."% decrease from previous period ({$previousTotal} views)";
        } else {
            static::$description = "📊 {$currentTotal} total views | No change from previous period ({$previousTotal} views)";
        }
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => false,
                ],
                'tooltip' => [
                    'mode' => 'index',
                    'intersect' => false,
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'ticks' => [
                        'precision' => 0,
                    ],
                    'grid' => [
                        'display' => true,
                        'drawBorder' => false,
                    ],
                ],
                'x' => [
                    'grid' => [
                        'display' => false,
                    ],
                ],
            ],
            'interaction' => [
                'mode' => 'nearest',
                'axis' => 'x',
                'intersect' => false,
            ],
        ];
    }
}
