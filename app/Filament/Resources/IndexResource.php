<?php

namespace App\Filament\Resources;

use App\Filament\Resources\IndexResource\Pages;
use App\Filament\Resources\PackageRelationManagerResource\RelationManagers\PackagesRelationManager;
use App\Models\Index;
use App\Models\Package;
use Filament\Forms\Form;
use Filament\Infolists\Components\ColorEntry;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\SpatieMediaLibraryImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class IndexResource extends Resource
{
    protected static ?string $model = Index::class;

    protected static ?string $navigationGroup = 'Packages';

    public static function form(Form $form): Form
    {
        return $form
            ->schema(Index::getFormSchema());
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\ColorColumn::make('color_code')
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->searchable(),
                Tables\Columns\SpatieMediaLibraryImageColumn::make('icon'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->slideOver(),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make('delete')
                    ->label('Delete')
                    ->icon('heroicon-o-trash')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn (Index $index) => $index->delete())
                    ->visible(fn (Index $index) => ! $index->trashed()),

                Tables\Actions\RestoreAction::make()
                    ->requiresConfirmation()
                    ->visible(fn (Package $package) => $package->trashed()),
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
            PackagesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListIndices::route('/'),
            'create' => Pages\CreateIndex::route('/create'),
            'view' => Pages\ViewIndex::route('/{record}'),
        ];
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Grid::make(3)
                    ->schema([
                        Grid::make()
                            ->columnSpan(2)
                            ->schema([
                                Section::make('Index Details')
                                    ->columns(2)
                                    ->schema([
                                        TextEntry::make('name'),
                                        TextEntry::make('slug'),
                                        TextEntry::make('description')
                                            ->columnSpanFull(),
                                    ]),
                            ]),
                        Grid::make()
                            ->columnSpan(1)
                            ->schema([
                                Section::make('Status')
                                    ->schema([
                                        ColorEntry::make('color_code'),
                                        TextEntry::make('status'),
                                        SpatieMediaLibraryImageEntry::make('icon'),
                                    ]),
                            ]),
                    ]),
            ]);
    }
}
