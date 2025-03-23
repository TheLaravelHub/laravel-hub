<?php

declare(strict_types=1);

namespace App\Filament\Resources\IndexResource\Pages;

use App\Filament\Resources\IndexResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

final class ListIndices extends ListRecords
{
    protected static string $resource = IndexResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
