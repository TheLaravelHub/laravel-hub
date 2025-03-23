<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasStatus;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Str;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

final class Category extends Model
{
    use HasActiveScope;
    use HasSlug;
    use HasStatus;
    use SoftDeletes;

    protected array $cascadeDeactivate = ['packages'];

    public static function getFormSchema(string $model): array
    {
        return [
            Grid::make(3)
                ->schema([
                    Grid::make(1)
                        ->columnSpan(2)
                        ->schema([
                            Section::make('Category Information')
                                ->columns(2)
                                ->schema([
                                    TextInput::make('name')
                                        ->live(onBlur: true)
                                        ->required()
                                        ->maxLength(255)
                                        ->afterStateUpdated(function (Set $set, ?string $state) {
                                            $set('slug', Str::slug($state));
                                        }),
                                    TextInput::make('slug')
                                        ->required()
//                                        ->unique(self::class, 'slug', fn ($query) => $query->where('category_type', $model))
                                        ->maxLength(255),
                                ]),

                            Section::make('SEO Meta Information')
                                ->schema([
                                    TextInput::make('meta_title')
                                        ->maxLength(255),
                                    Textarea::make('meta_description')
                                        ->maxLength(255),
                                ]),
                        ]),
                    Grid::make(1)
                        ->columnSpan(1)
                        ->schema([
                            Section::make('Status')
                                ->schema([
                                    Hidden::make('category_type')
                                        ->default($model),
                                    Toggle::make('status')
                                        ->default('active')
                                        ->onIcon('heroicon-o-check-circle')
                                        ->offIcon('heroicon-o-x-circle')
                                        ->onColor('success')
                                        ->offColor('danger')
                                        ->afterStateHydrated(fn ($state, callable $set) => $set('status', $state === 'active')),
                                ]),
                        ]),
                ]),
        ];
    }

    public static function getTableColumns(string $model): array
    {
        return [
            TextColumn::make('name')
                ->searchable()
                ->sortable(),
            TextColumn::make('slug')
                ->searchable()
                ->sortable(),
            TextColumn::make('packages')
                ->visible($model === Package::class)
                ->formatStateUsing(fn (Category $category) => $category->packages->count() ?? 0)
                ->sortable(),
            TextColumn::make('blogPosts')
                ->label('Blog Posts')
                ->visible($model === BlogPost::class)
                ->formatStateUsing(fn (Category $category) => $category->blogPosts->count() ?? 0)
                ->sortable(),
            ToggleColumn::make('status')
                ->onIcon('heroicon-o-check-circle')
                ->offIcon('heroicon-o-x-circle')
                ->onColor('success')
                ->offColor('danger')
                ->sortable()
                ->toggleable()
                ->getStateUsing(fn ($record) => $record->status === 'active')
                ->beforeStateUpdated(function ($record, $state) {
                    Notification::make()
                        ->title('Status Updated')
                        ->body('The status has been changed to '.($state ? 'Active' : 'Inactive'))
                        ->success()
                        ->send();
                }),
        ];
    }

    //    public function casts()
    //    {
    //        return [
    //            'status' => StatusCast::class,
    //        ];
    //    }

    /**
     * Scope to filter only package categories.
     */
    public function scopeForPackages($query)
    {
        return $query->where('category_type', Package::class);
    }

    /**
     * Scope to filter only blog categories.
     */
    public function scopeForBlogPosts($query)
    {
        return $query->where('category_type', BlogPost::class);
    }

    /**
     * Relationship: Category belongs to many Packages.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function packages()
    {
        return $this->belongsToMany(Package::class, 'category_package');
    }

    /**
     * Relationship: Category belongs to many BlogPosts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function blogPosts()
    {
        return $this->belongsToMany(BlogPost::class);
    }

    protected static function boot()
    {
        parent::boot();
        self::creating(static function ($category) {
            $category->slug = Str::slug($category->name);
        });
    }
}
