<?php

namespace App\Filament\Resources\PackageResource\Pages;

use App\Actions\GeneratePackageOgImageAction;
use App\Filament\Resources\PackageResource;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreatePackage extends CreateRecord
{
    protected static string $resource = PackageResource::class;

    protected function afterCreate(): void
    {
        try {
            app(GeneratePackageOgImageAction::class)->handle($this->record);

            Notification::make()
                ->title('OG Image Generated')
                ->success()
                ->send();
        } catch (\Exception $e) {
            Notification::make()
                ->title('Failed to generate OG image')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }
}
