<?php

namespace App\Filament\Resources\PackageResource\Pages;

use App\Actions\GeneratePackageOgImageAction;
use App\Filament\Resources\PackageResource;
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreatePackage extends CreateRecord
{
    protected static string $resource = PackageResource::class;

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('index');
    }

    protected function afterCreate(): void
    {
        $packageUrl = route('packages.show', $this->record->slug);

        Notification::make()
            ->title('Package Created Successfully!')
            ->body("View URL: {$packageUrl}")
            ->success()
            ->actions([
                Action::make('view')
                    ->label('Open Package')
                    ->url($packageUrl, shouldOpenInNewTab: true)
                    ->button(),
                Action::make('copy')
                    ->label('Copy URL')
                    ->button()
                    ->color('gray')
                    ->action(function () use ($packageUrl) {
                        $this->js("
                            navigator.clipboard.writeText('{$packageUrl}');
                            new FilamentNotification()
                                .title('URL Copied!')
                                .success()
                                .send()
                        ");
                    }),
            ])
            ->persistent()
            ->send();

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
