<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Searchable;
use Thefeqy\ModelStatus\Casts\StatusCast;
use Thefeqy\ModelStatus\Traits\HasActiveScope;
use App\Traits\HasStatus;

class Package extends Model
{
    use HasActiveScope;
    use HasSlug;
    use HasStatus;
    use Searchable;
    use SoftDeletes;

    protected $fillable = [
        'index_id', 'name', 'slug', 'description', 'repository_url', 'meta_title', 'meta_description',
        'language', 'stars', 'forks', 'open_issues', 'owner', 'owner_avatar',
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
}
