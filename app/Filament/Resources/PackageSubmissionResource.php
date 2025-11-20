<?php

namespace App\Filament\Resources;

use App\Enums\ReviewStatus;
use App\Filament\Resources\PackageSubmissionResource\Pages;
use App\Models\PackageSubmission;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PackageSubmissionResource extends Resource
{
    protected static ?string $model = PackageSubmission::class;

    protected static ?string $navigationGroup = 'Packages';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->latest('created_at');
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable(),
                Tables\Columns\ImageColumn::make('user.avatar_url')
                    ->label('')
                    ->circular()
                    ->defaultImageUrl(function (PackageSubmission $record) {
                        $name = $record->user?->name ?? 'User';
                        $initials = mb_substr(preg_replace('/\s+/', '', $name), 0, 2) ?: 'UH';

                        return 'https://ui-avatars.com/api/?name='.urlencode($initials).'&color=FFFFFF&background=111827';
                    })
                    ->width(40)
                    ->height(40),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Submitted By')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereHas('user', function (Builder $query) use ($search): Builder {
                            return $query->where('name', 'like', "%{$search}%");
                        });
                    }),
                Tables\Columns\TextColumn::make('repository_url')
                    ->label('Repository URL')
                    ->url(fn (PackageSubmission $record): string => $record->repository_url)
                    ->openUrlInNewTab()
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        ReviewStatus::PENDING->value => 'Pending',
                        ReviewStatus::APPROVED->value => 'Approved',
                        ReviewStatus::REJECTED->value => 'Rejected',
                    ])
                    ->default(ReviewStatus::PENDING->value)
                    ->label('Status'),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (PackageSubmission $record): bool => $record->status !== ReviewStatus::APPROVED->value)
                    ->action(function (PackageSubmission $record): void {
                        $record->status = ReviewStatus::APPROVED->value;

                        // Only send notification if it hasn't been sent before
                        if (! $record->notification_sent) {
                            $record->user->notify(new \App\Notifications\PackageApprovedNotification($record));
                            $record->notification_sent = true;
                        }

                        $record->save();
                    }),
                Tables\Actions\Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (PackageSubmission $record): bool => $record->status !== ReviewStatus::REJECTED->value)
                    ->action(function (PackageSubmission $record): void {
                        $record->status = ReviewStatus::REJECTED->value;
                        $record->save();
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPackageSubmissions::route('/'),
        ];
    }
}
