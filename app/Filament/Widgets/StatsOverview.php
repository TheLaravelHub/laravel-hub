<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\Package;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;

class StatsOverview extends BaseWidget
{
    protected function getCards(): array
    {
        return [
            BaseWidget\Stat::make('Total Users', User::count())
                ->description('All registered users')
                ->color('primary'),
            BaseWidget\Stat::make('Blog Posts', BlogPost::count())
                ->description('Blog Posts')
                ->color('success'),
            BaseWidget\Stat::make('Total Packages', Package::count())
                ->description('Available packages')
                ->color('warning'),
        ];
    }
}
