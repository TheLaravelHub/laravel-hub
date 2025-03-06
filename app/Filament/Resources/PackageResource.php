<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PackageResource\Pages;
use App\Models\Package;
use Filament\Actions\RestoreAction;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Http;
use Str;

class PackageResource extends Resource
{
    protected static ?string $model = Package::class;

    protected static ?string $navigationIcon = 'heroicon-o-archive-box-arrow-down';

    protected static ?string $navigationGroup = 'Packages';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(3)
                    ->schema([
                        Forms\Components\Grid::make(1)
                            ->columnSpan(2)
                            ->schema([
                                Forms\Components\Section::make()
                                    ->schema([
                                        Forms\Components\Select::make('index_id')
                                            ->relationship('index', 'name')
                                            ->required()
                                            ->createOptionForm([
                                                Forms\Components\TextInput::make('name')
                                                    ->required()
                                                    ->live(onBlur: true)
                                                    ->afterStateUpdated(function (Forms\Set $set, ?string $state) {
                                                        $set('slug', Str::slug($state));
                                                    }),
                                                Forms\Components\TextInput::make('slug')
                                                    ->required(),
                                            ]),
                                        Forms\Components\Select::make('category_ids')
                                            ->relationship('categories', 'name')
                                            ->multiple()
                                            ->searchable()
                                            ->preload()
                                            ->required()
                                            ->createOptionForm([
                                                Forms\Components\TextInput::make('name')
                                                    ->required()
                                                    ->live(onBlur: true)
                                                    ->afterStateUpdated(function (Forms\Set $set, ?string $state) {
                                                        $set('slug', Str::slug($state));
                                                    }),
                                                Forms\Components\TextInput::make('slug')
                                                    ->required(),
                                                Forms\Components\Hidden::make('category_type')
                                                    ->default(Package::class),
                                            ]),
                                    ]),
                                Forms\Components\Section::make('Package Data')
                                    ->schema([
                                        Forms\Components\TextInput::make('repository_url')
                                            ->required()
                                            ->maxLength(255)
                                            ->suffixAction(
                                                Forms\Components\Actions\Action::make('fetchRepoData')
                                                    ->label('Fetch')
                                                    ->icon('heroicon-o-arrow-down-tray')
                                                    ->action(function (Forms\Set $set, Forms\Get $get) {
                                                        $repoUrl = $get('repository_url');

                                                        if (empty($repoUrl)) {
                                                            Notification::make()
                                                                ->title('Repository URL is required')
                                                                ->danger()
                                                                ->send();

                                                            return;
                                                        }

                                                        try {
                                                            // Call your internal API to get repository data
                                                            $response = Http::get(route('get-repository-data'), [
                                                                'repository_url' => $repoUrl,
                                                            ]);

                                                            if ($response->failed()) {
                                                                throw new \Exception('Failed to fetch repository data.');
                                                            }

                                                            $data = $response->json();

                                                            $set('name', $data['name'] ?? '');
                                                            $set('meta_title', $data['name'] ?? '');
                                                            $set('slug', Str::slug($data['name'] ?? ''));
                                                            $set('description', $data['description'] ?? '');
                                                            $set('meta_description', $data['description'] ?? '');
                                                            $set('language', $data['language'] ?? '');
                                                            $set('stars', $data['stars'] ?? 0);
                                                            $set('owner', $data['owner'] ?? '');
                                                            $set('owner_avatar', $data['owner_avatar'] ?? '');

                                                            Notification::make()
                                                                ->title('Repository Data Fetched Successfully')
                                                                ->success()
                                                                ->send();
                                                        } catch (\Throwable $e) {
                                                            Notification::make()
                                                                ->title('Error Fetching Repository Data')
                                                                ->danger()
                                                                ->body($e->getMessage())
                                                                ->send();
                                                        }
                                                    })
                                            ),
                                        Forms\Components\TextInput::make('name')
                                            ->live(onBlur: true)
                                            ->required()
                                            ->maxLength(255)
                                            ->afterStateUpdated(function (Forms\Set $set, ?string $state) {
                                                $set('slug', Str::slug($state));
                                            }),
                                        Forms\Components\TextInput::make('slug')
                                            ->required()
                                            ->disabled()
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('description')
                                            ->columnSpanFull(),
                                    ]),
                                Forms\Components\Section::make('SEO Meta Information')
                                    ->schema([
                                        Forms\Components\TextInput::make('meta_title')
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('meta_description')
                                            ->columnSpanFull(),
                                    ]),
                            ]),
                        Forms\Components\Grid::make(1)
                            ->columnSpan(1)
                            ->schema([
                                Forms\Components\Section::make('Repository Data')
                                    ->schema([
                                        Forms\Components\TextInput::make('language')
                                            ->maxLength(255),
                                        Forms\Components\TextInput::make('stars')
                                            ->required()
                                            ->numeric(),
                                        Forms\Components\TextInput::make('owner')
                                            ->maxLength(255),
                                        Forms\Components\TextInput::make('owner_avatar')
                                            ->label('Owner Avatar URL')
                                            ->maxLength(255),

                                        Forms\Components\Toggle::make('status')
                                            ->default('active')
                                            ->onIcon('heroicon-o-check-circle')
                                            ->offIcon('heroicon-o-x-circle')
                                            ->onColor('success')
                                            ->offColor('danger'),
                                    ]),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable(),
                Tables\Columns\TextColumn::make('index.name')
                    ->sortable(),
                Tables\Columns\TextColumn::make('categories.name')
                    ->badge()
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug'),
                Tables\Columns\TextColumn::make('stars')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\ImageColumn::make('owner_avatar')
                    ->circular(),
                Tables\Columns\ToggleColumn::make('status')
                    ->onIcon('heroicon-o-check-circle')
                    ->offIcon('heroicon-o-x-circle')
                    ->onColor('success')
                    ->offColor('danger')
                    ->sortable()
                    ->toggleable()
                    ->getStateUsing(fn (Package $package) => $package->status === 'active')
                    ->beforeStateUpdated(function ($record, $state) {
                        Notification::make()
                            ->title('Status Updated')
                            ->body('The status has been changed to '.($state ? 'Active' : 'Inactive'))
                            ->success()
                            ->send();
                    }),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->relationship('categories', 'name')
                    ->multiple()
                    ->searchable()
                    ->preload(),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                    ]),
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('delete')
                    ->label('Delete')
                    ->icon('heroicon-o-trash')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn (Package $package) => $package->delete())
                    ->visible(fn (Package $package) => ! $package->trashed()),

                Tables\Actions\RestoreAction::make()
                    ->requiresConfirmation()
                    ->visible(fn (Package $package) => $package->trashed()),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    //                    RestoreAction::make()
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
            'index' => Pages\ListPackages::route('/'),
            'create' => Pages\CreatePackage::route('/create'),
            'edit' => Pages\EditPackage::route('/{record}/edit'),
        ];
    }
}
