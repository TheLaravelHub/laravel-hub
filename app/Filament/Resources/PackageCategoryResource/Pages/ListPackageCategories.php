<?php

namespace App\Filament\Resources\PackageCategoryResource\Pages;

use App\Filament\Resources\PackageCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPackageCategories extends ListRecords
{
    protected static string $resource = PackageCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
