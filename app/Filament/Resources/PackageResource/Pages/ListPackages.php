<?php

declare(strict_types=1);

namespace App\Filament\Resources\PackageResource\Pages;

use App\Filament\Resources\PackageResource;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\SoftDeletingScope;

final class ListPackages extends ListRecords
{
    protected static string $resource = PackageResource::class;

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Packages')
                ->modifyQueryUsing(function ($query) {
                    return $query->withoutGlobalScope(SoftDeletingScope::class)
                        ->whereIn('status', ['active', 'inactive']);
                }),

            'active' => Tab::make('Active')
                ->modifyQueryUsing(function ($query) {
                    return $query->withoutGlobalScope(SoftDeletingScope::class)
                        ->where('status', 'active');
                }),

            'inactive' => Tab::make('Inactive')
                ->modifyQueryUsing(function ($query) {
                    return $query->withoutGlobalScope(SoftDeletingScope::class)
                        ->where('status', 'inactive');
                }),
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
