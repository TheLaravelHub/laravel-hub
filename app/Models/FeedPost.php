<?php

namespace App\Models;

use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeedPost extends Model
{
    use Filterable;
    use SoftDeletes;

    protected $fillable = [
        'feed_source_id',
        'title',
        'slug',
        'subtitle',
        'excerpt',
        'content',
        'image_url',
        'external_url',
        'external_id',
        'published_at',
        'upvotes_count',
        'downvotes_count',
        'comments_count',
        'bookmarks_count',
        'shares_count',
        'views_count',
        'tags',
        'metadata',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'tags' => 'array',
        'metadata' => 'array',
    ];

    public function source(): BelongsTo
    {
        return $this->belongsTo(FeedSource::class, 'feed_source_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(FeedComment::class)->whereNull('parent_id');
    }

    public function allComments(): HasMany
    {
        return $this->hasMany(FeedComment::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(FeedPostVote::class);
    }

    public function upvotes(): HasMany
    {
        return $this->hasMany(FeedPostVote::class)->where('vote_type', 'upvote');
    }

    public function downvotes(): HasMany
    {
        return $this->hasMany(FeedPostVote::class)->where('vote_type', 'downvote');
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(FeedPostBookmark::class);
    }

    public function upvotedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'feed_post_votes')
            ->using(FeedPostVote::class)
            ->wherePivot('vote_type', 'upvote')
            ->withTimestamps();
    }

    public function downvotedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'feed_post_votes')
            ->using(FeedPostVote::class)
            ->wherePivot('vote_type', 'downvote')
            ->withTimestamps();
    }

    public function bookmarkedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'feed_post_bookmarks')
            ->using(FeedPostBookmark::class)
            ->withTimestamps();
    }

    public function scopePopular($query)
    {
        return $query->orderByDesc('upvotes_count');
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('published_at');
    }

    public function scopeTrending($query)
    {
        return $query->where('published_at', '>=', now()->subDays(7))
            ->orderByDesc('upvotes_count');
    }

    public function hasUserUpvoted(?int $userId = null): bool
    {
        $userId = $userId ?? auth()->id();
        if (! $userId) {
            return false;
        }

        if ($this->relationLoaded('upvotedBy')) {
            return $this->upvotedBy->contains('id', $userId);
        }

        return $this->upvotedBy()->where('user_id', $userId)->exists();
    }

    public function hasUserDownvoted(?int $userId = null): bool
    {
        $userId = $userId ?? auth()->id();
        if (! $userId) {
            return false;
        }

        if ($this->relationLoaded('downvotedBy')) {
            return $this->downvotedBy->contains('id', $userId);
        }

        return $this->downvotedBy()->where('user_id', $userId)->exists();
    }

    public function hasUserBookmarked(?int $userId = null): bool
    {
        $userId = $userId ?? auth()->id();
        if (! $userId) {
            return false;
        }

        if ($this->relationLoaded('bookmarkedBy')) {
            return $this->bookmarkedBy->contains('id', $userId);
        }

        return $this->bookmarkedBy()->where('user_id', $userId)->exists();
    }
}
