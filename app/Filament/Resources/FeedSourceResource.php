<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FeedSourceResource\Pages;
use App\Filament\Resources\FeedSourceResource\RelationManagers;
use App\Models\FeedSource;
use Filament\Forms;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FeedSourceResource extends Resource
{
    protected static ?string $model = FeedSource::class;

    protected static ?string $navigationIcon = 'heroicon-o-rss';

    protected static ?string $navigationGroup = 'Feed Management';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(FeedSource::class, 'slug', ignoreRecord: true)
                            ->rules(['alpha_dash']),

                        Forms\Components\Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),

                        Forms\Components\Grid::make(2)
                            ->schema([
                                SpatieMediaLibraryFileUpload::make('source_logo')
                                    ->label('Upload Logo')
                                    ->disk('blog-posts')
                                    ->collection('source_logo')
                                    ->image()
                                    ->imageEditor()
                                    ->imageEditorAspectRatios([
                                        '1:1',
                                    ])
                                    ->maxSize(2048)
                                    ->helperText('Upload a custom logo (max 2MB, 200x200px recommended)')
                                    ->columnSpan(1),

                                Forms\Components\Select::make('logo_url')
                                    ->label('Or Select Predefined Icon')
                                    ->options([
                                        'https://laravel-news.com/images/logo.png' => 'Laravel News',
                                        'https://freek.dev/favicon.ico' => 'Freek.dev',
                                        'https://laracasts.com/images/logo/logo-circle.svg' => 'Laracasts',
                                        'https://php.watch/icon.png' => 'PHP Watch',
                                        Storage::url('assets/images/logo.png') => 'Laravel Hub',
                                    ])
                                    ->searchable()
                                    ->helperText('Choose a predefined icon instead of uploading')
                                    ->placeholder('Select an icon...')
                                    ->columnSpan(1),
                            ])
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Feed Configuration')
                    ->schema([
                        Forms\Components\TextInput::make('website_url')
                            ->label('Website URL')
                            ->url()
                            ->maxLength(255)
                            ->placeholder('https://example.com'),

                        Forms\Components\TextInput::make('rss_feed_url')
                            ->label('RSS Feed URL')
                            ->required()
                            ->url()
                            ->maxLength(255)
                            ->placeholder('https://example.com/feed.xml'),

                        Forms\Components\Select::make('type')
                            ->required()
                            ->options([
                                'article' => 'Article',
                                'video' => 'Video',
                            ])
                            ->default('article')
                            ->native(false),

                        Forms\Components\TextInput::make('fetch_frequency_minutes')
                            ->label('Fetch Frequency (minutes)')
                            ->required()
                            ->numeric()
                            ->default(60)
                            ->minValue(5)
                            ->maxValue(1440)
                            ->helperText('How often to fetch new posts (5-1440 minutes)'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Enable or disable this feed source'),

                        Forms\Components\Placeholder::make('last_fetched_at')
                            ->label('Last Fetched')
                            ->content(fn (FeedSource $record): string => $record->last_fetched_at?->diffForHumans() ?? 'Never')
                            ->hidden(fn (string $operation) => $operation === 'create'),
                    ])
                    ->columns(1),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\SpatieMediaLibraryImageColumn::make('source_logo')
                    ->collection('source_logo')
                    ->label('Logo')
                    ->circular()
                    ->defaultImageUrl(Storage::url('assets/images/placeholder-logo.png')),

                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),

                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\BadgeColumn::make('type')
                    ->colors([
                        'primary' => 'article',
                        'danger' => 'video',
                    ])
                    ->icons([
                        'heroicon-o-document-text' => 'article',
                        'heroicon-o-video-camera' => 'video',
                    ]),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('posts_count')
                    ->label('Posts')
                    ->counts('posts')
                    ->sortable(),

                Tables\Columns\TextColumn::make('last_fetched_at')
                    ->label('Last Fetched')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('fetch_frequency_minutes')
                    ->label('Frequency')
                    ->suffix(' min')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'article' => 'Article',
                        'video' => 'Video',
                    ]),

                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active')
                    ->placeholder('All sources')
                    ->trueLabel('Active sources')
                    ->falseLabel('Inactive sources'),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->modalHeading('Delete Feed Source')
                    ->modalDescription('This will also soft delete all posts from this source. You can restore them later.')
                    ->modalSubmitActionLabel('Yes, delete it')
                    ->successNotificationTitle('Feed source and all its posts have been deleted'),
                Tables\Actions\RestoreAction::make()
                    ->requiresConfirmation()
                    ->modalHeading('Restore Feed Source')
                    ->modalDescription('This will also restore all soft-deleted posts from this source.')
                    ->modalSubmitActionLabel('Yes, restore it')
                    ->successNotificationTitle('Feed source and all its posts have been restored'),
                Tables\Actions\ForceDeleteAction::make()
                    ->requiresConfirmation()
                    ->modalHeading('Permanently Delete Feed Source')
                    ->modalDescription('This will permanently delete the feed source and ALL its posts. This action cannot be undone!')
                    ->modalSubmitActionLabel('Yes, permanently delete')
                    ->successNotificationTitle('Feed source and all its posts have been permanently deleted'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->requiresConfirmation()
                        ->modalHeading('Delete Selected Feed Sources')
                        ->modalDescription('This will also soft delete all posts from these sources. You can restore them later.')
                        ->modalSubmitActionLabel('Yes, delete them')
                        ->successNotificationTitle('Feed sources and all their posts have been deleted'),
                    Tables\Actions\RestoreBulkAction::make()
                        ->requiresConfirmation()
                        ->modalHeading('Restore Selected Feed Sources')
                        ->modalDescription('This will also restore all soft-deleted posts from these sources.')
                        ->modalSubmitActionLabel('Yes, restore them')
                        ->successNotificationTitle('Feed sources and all their posts have been restored'),
                    Tables\Actions\ForceDeleteBulkAction::make()
                        ->requiresConfirmation()
                        ->modalHeading('Permanently Delete Selected Feed Sources')
                        ->modalDescription('This will permanently delete the feed sources and ALL their posts. This action cannot be undone!')
                        ->modalSubmitActionLabel('Yes, permanently delete')
                        ->successNotificationTitle('Feed sources and all their posts have been permanently deleted'),
                ]),
            ])
            ->defaultSort('name');
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\PostsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFeedSources::route('/'),
            'create' => Pages\CreateFeedSource::route('/create'),
            'view' => Pages\ViewFeedSource::route('/{record}'),
            'edit' => Pages\EditFeedSource::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_active', true)->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }
}
