<?php

declare(strict_types=1);

namespace App\Filament\Resources\PackageCategoryResource\Pages;

use App\Filament\Resources\PackageCategoryResource;
use Filament\Resources\Pages\CreateRecord;

final class CreatePackageCategory extends CreateRecord
{
    protected static string $resource = PackageCategoryResource::class;
}
