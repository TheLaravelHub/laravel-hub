<?php

declare(strict_types=1);

namespace App\Filament\Resources\CategoryResource\Pages;

use App\Filament\Resources\PackageCategoryResource;
use Filament\Resources\Pages\ViewRecord;

final class ViewPackageCategory extends ViewRecord
{
    protected static string $resource = PackageCategoryResource::class;
}
