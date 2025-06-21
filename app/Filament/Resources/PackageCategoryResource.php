<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages\ViewPackageCategory;
use App\Filament\Resources\PackageCategoryResource\Pages;
use App\Filament\Resources\PackageRelationManagerResource\RelationManagers\PackagesRelationManager;
use App\Models\Category;
use App\Models\Package;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PackageCategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $label = 'Package Categories';

    protected static ?string $navigationGroup = 'Packages';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('category_type', Package::class);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema(Category::getFormSchema(model: Package::class));
    }

    public static function table(Table $table): Table
    {
        return $table
            ->query(
                fn () => static::getEloquentQuery()->withCount('packages')
            )
            ->persistFiltersInSession()
            ->filtersTriggerAction(function ($action) {
                return $action->button()->label('Filters');
            })
            ->columns(Category::getTableColumns())
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                    ]),
                Tables\Filters\TrashedFilter::make(),
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
                    ->action(fn (Category $category) => $category->delete())
                    ->visible(fn (Category $category) => ! $category->trashed()),

                Tables\Actions\RestoreAction::make()
                    ->requiresConfirmation()
                    ->visible(fn (Category $category) => $category->trashed()),
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
            'index' => Pages\ListPackageCategories::route('/'),
            'create' => Pages\CreatePackageCategory::route('/create'),
            // 'edit' => Pages\EditPackageCategory::route('/{record}/edit'),
            'view' => ViewPackageCategory::route('/{record}'),
        ];
    }
}
