<?php

namespace App\Filament\Resources\PackageResource\Pages;

use App\Actions\GeneratePackageOgImageAction;
use App\Filament\Resources\PackageResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Log;

class EditPackage extends EditRecord
{
    protected static string $resource = PackageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        Log::info('EditPackage afterSave triggered', ['package_id' => $this->record->id]);

        try {
            app(GeneratePackageOgImageAction::class)->handle($this->record);

            Notification::make()
                ->title('OG Image Regenerated')
                ->success()
                ->send();
        } catch (\Exception $e) {
            Log::error('OG Image Generation Error in afterSave', [
                'package_id' => $this->record->id,
                'error' => $e->getMessage(),
            ]);

            Notification::make()
                ->title('Failed to regenerate OG image')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }
}
