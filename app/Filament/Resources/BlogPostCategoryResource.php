<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BlogPostCategoryResource\Pages;
use App\Filament\Resources\BlogPostCategoryResource\RelationManagers\BlogPostsRelationManager;
use App\Models\BlogPost;
use App\Models\Category;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class BlogPostCategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $label = 'Post Categories';

    protected static ?string $navigationGroup = 'Blog';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('category_type', BlogPost::class);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema(Category::getFormSchema(model: BlogPost::class));
    }

    public static function table(Table $table): Table
    {
        return $table
            ->query(
                fn () => static::getEloquentQuery()->withCount('blogPosts')
            )
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
            BlogPostsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBlogPostCategories::route('/'),
            'create' => Pages\CreateBlogPostCategory::route('/create'),
            'view' => Pages\ViewBlogPostCategory::route('/{record}'),
        ];
    }
}
