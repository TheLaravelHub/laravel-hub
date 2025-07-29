<?php

namespace App\Filament\Resources\PackageSubmissionResource\Pages;

use App\Filament\Resources\PackageSubmissionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPackageSubmissions extends ListRecords
{
    protected static string $resource = PackageSubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
