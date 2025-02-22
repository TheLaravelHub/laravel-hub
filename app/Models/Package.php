<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

class Package extends Model
{
    use HasActiveScope;
    use HasSlug;
    use SoftDeletes;

    protected $fillable = [
        'index_id', 'name', 'slug', 'description', 'repository_url', 'meta_title', 'meta_description',
        'language', 'stars', 'forks', 'open_issues', 'owner', 'owner_avatar',
    ];

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
}
