<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasStatus;
use EloquentFilter\Filterable;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Thefeqy\ModelStatus\Casts\StatusCast;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

class Package extends Model implements HasMedia
{
    use Filterable;
    use HasActiveScope;
    use HasSlug;
    use HasStatus;
    use InteractsWithMedia;
    use Searchable;
    use SoftDeletes;

    //    public function casts()
    //    {
    //        return [
    //            'status' => StatusCast::class,
    //        ];
    //    }

    /**
     * Relationship: Package belongs to an Index
     *
     * @deprecated
     */
    public function index(): BelongsTo
    {
        return $this->belongsTo(Index::class);
    }

    public function indexes(): BelongsToMany
    {
        return $this->belongsToMany(Index::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: Package belongs to multiple Categories
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_package');
    }

    public function searchableAs(): string
    {
        return 'packages_index_'.env('APP_ENV');
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    #[SearchUsingFullText(['name', 'description', 'owner'])]
    public function toSearchableArray()
    {
        return [
            ...$this->toArray(),
            'categories' => $this->categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ];
            }),
            'indexes' => $this->indexes->map(function ($index) {
                return [
                    'id' => $index->id,
                    'name' => $index->name,
                    'slug' => $index->slug,
                    'color_code' => $index->color_code,
                ];
            }),
        ];
    }

    public static function getFormSchema(?int $categoryId = null, ?int $indexId = null): array
    {
        return [
            Grid::make(3)
                ->schema([
                    Grid::make(1)
                        ->columnSpan(2)
                        ->schema([
                            Section::make()
                                ->schema([
                                    Select::make('index_ids')
                                        ->relationship('indexes', 'name')
                                        ->required()
                                        ->multiple()
                                        ->searchable()
                                        ->preload()
                                        ->visible(function () use ($indexId) {
                                            return $indexId === null;
                                        })
                                        ->createOptionForm(Index::getFormSchema()),
                                    Select::make('category_ids')
                                        ->relationship('categories', 'name', function ($query) {
                                            return $query->forPackages();
                                        })
                                        ->visible(function () use ($categoryId) {
                                            return $categoryId === null;
                                        })
                                        ->multiple()
                                        ->searchable()
                                        ->preload()
                                        ->required()
                                        ->createOptionForm([
                                            TextInput::make('name')
                                                ->required()
                                                ->live(onBlur: true)
                                                ->afterStateUpdated(function (Set $set, ?string $state) {
                                                    $set('slug', Category::generateSlug($state));
                                                }),
                                            TextInput::make('slug')
                                                ->required(),
                                            Hidden::make('category_type')
                                                ->default(__CLASS__),
                                        ]),
                                ]),
                            Section::make('Package Data')
                                ->schema([
                                    Select::make('user_id')
                                        ->label('Submitted By')
                                        ->relationship('user', 'name')
                                        ->searchable(['name', 'email'])
                                        ->preload()
                                        ->default(fn () => auth()->id())
                                        ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->name} ({$record->email})")
                                        ->searchPrompt('Search by name or email'),
                                    TextInput::make('repository_url')
                                        ->required()
                                        ->rules(function (Get $get) {
                                            $recordId = $get('id');

                                            return [
                                                Rule::unique('packages', 'repository_url')->ignore($recordId),
                                            ];
                                        })
                                        ->maxLength(255)
                                        ->suffixAction(
                                            Action::make('fetchRepoData')
                                                ->label('Fetch')
                                                ->icon('heroicon-o-arrow-down-tray')
                                                ->action(function (Set $set, Get $get) {
                                                    $repoUrl = $get('repository_url');

                                                    if (empty($repoUrl)) {
                                                        Notification::make()
                                                            ->title('Repository URL is required')
                                                            ->danger()
                                                            ->send();

                                                        return;
                                                    }

                                                    try {
                                                        $response = Http::get(route('get-repository-data'), [
                                                            'repository_url' => $repoUrl,
                                                        ]);

                                                        if ($response->failed()) {
                                                            throw new \Exception('Failed to fetch repository data.');
                                                        }

                                                        $data = $response->json();

                                                        $set('name', $data['name'] ?? '');
                                                        $set('meta_title', $data['name'] ?? '');
                                                        $set('slug', self::generateSlug($data['name'] ?? ''));
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
                                    TextInput::make('name')
                                        ->live(onBlur: true)
                                        ->required()
                                        ->maxLength(255)
                                        ->afterStateUpdated(function (Set $set, ?string $state) {
                                            $set('slug', self::generateSlug($state));
                                        }),
                                    TextInput::make('slug')
                                        ->required()
                                        ->maxLength(255),
                                    Textarea::make('description')
                                        ->columnSpanFull(),
                                ]),
                            Section::make('SEO Meta Information')
                                ->schema([
                                    TextInput::make('meta_title')
                                        ->maxLength(255),
                                    Textarea::make('meta_description')
                                        ->columnSpanFull(),
                                ]),
                        ]),
                    Grid::make(1)
                        ->columnSpan(1)
                        ->schema([
                            Section::make('Repository Data')
                                ->schema([
                                    TextInput::make('language')
                                        ->maxLength(255),
                                    TextInput::make('stars')
                                        ->required()
                                        ->numeric(),
                                    TextInput::make('owner')
                                        ->maxLength(255),
                                    TextInput::make('owner_avatar')
                                        ->label('Owner Avatar URL')
                                        ->maxLength(255),

                                    Toggle::make('status')
                                        ->default('active')
                                        ->onIcon('heroicon-o-check-circle')
                                        ->offIcon('heroicon-o-x-circle')
                                        ->onColor('success')
                                        ->offColor('danger')
                                        ->afterStateHydrated(fn ($state, callable $set) => $set('status', $state === 'active')),

                                    Toggle::make('is_featured')
                                        ->default(0)
                                        ->onIcon('heroicon-o-check-circle')
                                        ->offIcon('heroicon-o-x-circle')
                                        ->onColor('success')
                                        ->offColor('danger'),
                                ]),
                        ]),
                ]),
        ];
    }

    public static function boot()
    {
        parent::boot();

        static::created(function (Package $package) {
            $package->searchable();
        });

        static::updated(function (Package $package) {
            $package->searchable();
        });
    }
}
