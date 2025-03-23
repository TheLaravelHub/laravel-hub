<?php

declare(strict_types=1);

namespace App\Filament\Resources\IndexResource\Pages;

use App\Filament\Resources\IndexResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

final class EditIndex extends EditRecord
{
    protected static string $resource = IndexResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
