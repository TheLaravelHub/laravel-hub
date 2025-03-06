<?php

namespace App\Filament\Resources\PackageRelationManagerResource\RelationManagers;

use App\Models\Package;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PackagesRelationManager extends RelationManager
{
    protected static string $relationship = 'packages';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
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
                    ->getStateUsing(fn(Package $package) => $package->status === 'active')
                    ->beforeStateUpdated(function ($record, $state) {
                        Notification::make()
                            ->title('Status Updated')
                            ->body('The status has been changed to ' . ($state ? 'Active' : 'Inactive'))
                            ->success()
                            ->send();
                    }),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
