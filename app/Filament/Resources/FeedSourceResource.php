<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FeedSourceResource\Pages;
use App\Models\FeedSource;
use Filament\Forms;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
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
                                        asset('assets/images/logo.png') => 'Laravel Hub',
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
                    ->defaultImageUrl(asset('assets/images/placeholder-logo.png')),

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
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('name');
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
            'index' => Pages\ListFeedSources::route('/'),
            'create' => Pages\CreateFeedSource::route('/create'),
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
