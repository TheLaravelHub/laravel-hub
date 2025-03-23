<?php

declare(strict_types=1);

namespace App\Filament\Resources\IndexResource\Pages;

use App\Filament\Resources\IndexResource;
use Filament\Resources\Pages\CreateRecord;

final class CreateIndex extends CreateRecord
{
    protected static string $resource = IndexResource::class;
}
