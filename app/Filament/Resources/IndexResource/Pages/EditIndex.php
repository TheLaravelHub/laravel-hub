<?php

namespace App\Filament\Resources\IndexResource\Pages;

use App\Filament\Resources\IndexResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditIndex extends EditRecord
{
    protected static string $resource = IndexResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
