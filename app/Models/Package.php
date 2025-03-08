<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasStatus;
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
use Http;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Searchable;
use Str;
use Thefeqy\ModelStatus\Casts\StatusCast;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

class Package extends Model
{
    use HasActiveScope;
    use HasSlug;
    use HasStatus;
    use Searchable;
    use SoftDeletes;

    protected $fillable = [
        'index_id',
        'name',
        'slug',
        'description',
        'repository_url',
        'meta_title',
        'meta_description',
        'language',
        'stars',
        'owner',
        'owner_avatar',
    ];

    //    public function casts()
    //    {
    //        return [
    //            'status' => StatusCast::class,
    //        ];
    //    }

    /**
     * Relationship: Package belongs to an Index
     */
    public function index(): BelongsTo
    {
        return $this->belongsTo(Index::class);
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
        return $this->toArray();
    }

    public static function getFormSchema(?int $categoryId = null): array
    {
        return [
            Grid::make(3)
                ->schema([
                    Grid::make(1)
                        ->columnSpan(2)
                        ->schema([
                            Section::make()
                                ->schema([
                                    Select::make('index_id')
                                        ->relationship('index', 'name')
                                        ->required()
                                        ->createOptionForm([
                                            TextInput::make('name')
                                                ->required()
                                                ->live(onBlur: true)
                                                ->afterStateUpdated(function (Set $set, ?string $state) {
                                                    $set('slug', Str::slug($state));
                                                }),
                                            TextInput::make('slug')
                                                ->required(),
                                        ]),
                                    Select::make('category_ids')
                                        ->relationship('categories', 'name')
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
                                                    $set('slug', Str::slug($state));
                                                }),
                                            TextInput::make('slug')
                                                ->required(),
                                            Hidden::make('category_type')
                                                ->default(Package::class),
                                        ]),
                                ]),
                            Section::make('Package Data')
                                ->schema([
                                    TextInput::make('repository_url')
                                        ->required()
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
                                    TextInput::make('name')
                                        ->live(onBlur: true)
                                        ->required()
                                        ->maxLength(255)
                                        ->afterStateUpdated(function (Set $set, ?string $state) {
                                            $set('slug', Str::slug($state));
                                        }),
                                    TextInput::make('slug')
                                        ->required()
                                        ->disabled()
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
