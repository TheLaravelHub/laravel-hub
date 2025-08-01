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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\FilamentMarkdownEditor\MarkdownEditor;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class BlogPost extends Model implements HasMedia
{
    use HasSlug;
    use InteractsWithMedia;
    use SoftDeletes;

    protected $sluggable = 'title';

    protected static function booted(): void
    {
        static::creating(function (BlogPost $blogPost) {
            if ($blogPost->status === 'published' && empty($blogPost->published_at)) {
                $blogPost->published_at = now();
            }
        });

        static::updating(function (BlogPost $blogPost) {
            if ($blogPost->status === 'published' && empty($blogPost->published_at)) {
                $blogPost->published_at = now();
            }
        });
    }

    public function author()
    {
        return $this->belongsTo(User::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    /**
     * Get the views for this blog post.
     */
    public function views()
    {
        return $this->hasMany(BlogPostView::class);
    }

    /**
     * Get the count of unique views for this blog post.
     */
    public function getUniqueViewsCountAttribute(): int
    {
        return $this->views()->count();
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

    public static function popularThisWeek($limit = 6)
    {
        return self::query()
            ->select('blog_posts.id', 'blog_posts.title', 'blog_posts.slug', DB::raw('COUNT(blog_post_views.id) as views_count'))
            ->join('blog_post_views', 'blog_posts.id', '=', 'blog_post_views.blog_post_id')
            ->whereBetween('blog_post_views.created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->published()
            ->groupBy('blog_posts.id')
            ->orderByDesc('views_count')
            ->limit($limit)
            ->with('categories')
            ->get();
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
                                        ->fileAttachmentsDisk('blog-posts')
                                        ->fileAttachmentsVisibility('public')
                                        ->required(),
                                    SpatieMediaLibraryFileUpload::make('image')
                                        ->disk('blog-posts')
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
}
