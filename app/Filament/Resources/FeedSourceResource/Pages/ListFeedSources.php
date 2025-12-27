<?php

namespace App\Filament\Resources\FeedSourceResource\Pages;

use App\Filament\Resources\FeedSourceResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFeedSources extends ListRecords
{
    protected static string $resource = FeedSourceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
