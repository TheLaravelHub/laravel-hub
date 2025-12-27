<?php

namespace App\Filament\Resources\FeedSourceResource\Pages;

use App\Filament\Resources\FeedSourceResource;
use Filament\Actions;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\SpatieMediaLibraryImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Pages\ViewRecord;

class ViewFeedSource extends ViewRecord
{
    protected static string $resource = FeedSourceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Section::make('Basic Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                SpatieMediaLibraryImageEntry::make('source_logo')
                                    ->label('Logo')
                                    ->collection('source_logo')
                                    ->defaultImageUrl(fn ($record) => $record->logo_url ?? asset('assets/images/placeholder-logo.png'))
                                    ->circular()
                                    ->columnSpan(1),

                                Grid::make(1)
                                    ->schema([
                                        TextEntry::make('name')
                                            ->weight('bold')
                                            ->size('lg'),

                                        TextEntry::make('slug')
                                            ->badge()
                                            ->color('gray'),
                                    ])
                                    ->columnSpan(1),
                            ]),

                        TextEntry::make('description')
                            ->columnSpanFull()
                            ->placeholder('No description provided'),
                    ])
                    ->columns(2),

                Section::make('Feed Configuration')
                    ->schema([
                        TextEntry::make('website_url')
                            ->label('Website URL')
                            ->url(fn ($state) => $state)
                            ->openUrlInNewTab()
                            ->placeholder('Not specified')
                            ->icon('heroicon-o-globe-alt'),

                        TextEntry::make('rss_feed_url')
                            ->label('RSS Feed URL')
                            ->url(fn ($state) => $state)
                            ->openUrlInNewTab()
                            ->icon('heroicon-o-rss')
                            ->copyable(),

                        TextEntry::make('type')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'article' => 'primary',
                                'video' => 'danger',
                                default => 'gray',
                            })
                            ->icon(fn (string $state): string => match ($state) {
                                'article' => 'heroicon-o-document-text',
                                'video' => 'heroicon-o-video-camera',
                                default => 'heroicon-o-question-mark-circle',
                            }),

                        TextEntry::make('fetch_frequency_minutes')
                            ->label('Fetch Frequency')
                            ->suffix(' minutes')
                            ->icon('heroicon-o-clock'),
                    ])
                    ->columns(2),

                Section::make('Status & Statistics')
                    ->schema([
                        TextEntry::make('is_active')
                            ->label('Status')
                            ->badge()
                            ->formatStateUsing(fn (bool $state): string => $state ? 'Active' : 'Inactive')
                            ->color(fn (bool $state): string => $state ? 'success' : 'danger')
                            ->icon(fn (bool $state): string => $state ? 'heroicon-o-check-circle' : 'heroicon-o-x-circle'),

                        TextEntry::make('posts_count')
                            ->label('Total Posts')
                            ->state(fn ($record) => $record->posts()->count())
                            ->badge()
                            ->color('info')
                            ->icon('heroicon-o-document-duplicate'),

                        TextEntry::make('last_fetched_at')
                            ->label('Last Fetched')
                            ->dateTime()
                            ->since()
                            ->placeholder('Never')
                            ->icon('heroicon-o-clock'),

                        TextEntry::make('created_at')
                            ->label('Created')
                            ->dateTime()
                            ->since()
                            ->icon('heroicon-o-calendar'),
                    ])
                    ->columns(2),
            ]);
    }
}
