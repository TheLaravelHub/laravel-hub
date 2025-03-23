<?php

namespace App\Models;

use App\Traits\HasSlug;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Set;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\FilamentMarkdownEditor\MarkdownEditor;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Str;

class BlogPost extends Model implements HasMedia
{
    use HasSlug;
    use InteractsWithMedia;
    use SoftDeletes;

    protected $sluggable = 'title';

    public function author()
    {
        return $this->belongsTo(User::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function casts()
    {
        return [
            'scheduled_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }

    public function scopeScheduled(Builder $query): Builder
    {
        return $query->where('status', 'scheduled')
            ->where('scheduled_at', '>', now());
    }

    public function scopeNeedsPublishing(Builder $query)
    {
        return $query->where('status', 'scheduled')
            ->where('scheduled_at', '>=', now());
    }

    public static function getFormSchema(?int $categoryId = null, ?int $indexId = null): array
    {
        return [
            Grid::make(3)
                ->schema([
                    Grid::make(1)
                        ->columnSpan(2)
                        ->schema([
                            Hidden::make('author_id')
                                ->default(auth()->id()),
                            Section::make()
                                ->schema([
                                    Select::make('category_ids')
                                        ->relationship('categories', 'name', function ($query) {
                                            return $query->forBlogPosts();
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
                                                    $set('slug', Str::slug($state));
                                                }),
                                            TextInput::make('slug')
                                                ->required(),
                                            Hidden::make('category_type')
                                                ->default(__CLASS__),
                                        ]),
                                ]),
                            Section::make('Post Data')
                                ->schema([
                                    TextInput::make('title')
                                        ->live(onBlur: true)
                                        ->required()
                                        ->maxLength(255)
                                        ->afterStateUpdated(function (Set $set, ?string $state) {
                                            $set('slug', Str::slug($state));
                                        }),
                                    TextInput::make('sub_title')
                                        ->maxLength(255),
                                    TextInput::make('slug')
                                        ->required()
                                        ->maxLength(255),
                                    MarkdownEditor::make('content')
                                        ->fileAttachmentsDisk('public')
                                        ->fileAttachmentsVisibility('public')
                                        ->required(),
                                    SpatieMediaLibraryFileUpload::make('image')
                                        ->required()
                                        ->imageEditor(),
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
                            Section::make('Publishing')
                                ->schema([
                                    Select::make('status')
                                        ->label('Post Status')
                                        ->options([
                                            'draft' => 'Draft',
                                            'scheduled' => 'Scheduled',
                                            'published' => 'Published',
                                        ])
                                        ->default('draft')
                                        ->reactive()
                                        ->afterStateHydrated(fn ($state, callable $set) => $set('status', $state ?? 'draft')
                                        ),

                                    DateTimePicker::make('scheduled_at')
                                        ->label('Schedule Publish Time')
                                        ->native(false) // Use Filament's date picker instead of the browser's default
                                        ->seconds(false) // Hide seconds if unnecessary
                                        ->minDate(now()) // Prevent selecting past dates
                                        ->hidden(fn ($get) => $get('status') !== 'scheduled'),
                                ]),
                        ]),
                ]),
        ];
    }

    public static function boot(): void
    {
        parent::boot();

        static::saving(static function (BlogPost $post) {
            if ($post->status === 'published' && ! $post->published_at) {
                $post->published_at = now();
            }
        });
    }
}
