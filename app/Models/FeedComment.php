<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeedComment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'feed_post_id',
        'user_id',
        'parent_id',
        'content',
        'upvotes_count',
        'downvotes_count',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(FeedPost::class, 'feed_post_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(FeedComment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(FeedComment::class, 'parent_id');
    }

    public function upvotedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'feed_comment_user')
            ->wherePivot('vote_type', 'upvote')
            ->withTimestamps();
    }

    public function downvotedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'feed_comment_user')
            ->wherePivot('vote_type', 'downvote')
            ->withTimestamps();
    }

    public function hasUserUpvoted(?int $userId = null): bool
    {
        $userId = $userId ?? auth()->id();
        if (! $userId) {
            return false;
        }

        return $this->upvotedBy()->where('user_id', $userId)->exists();
    }

    public function hasUserDownvoted(?int $userId = null): bool
    {
        $userId = $userId ?? auth()->id();
        if (! $userId) {
            return false;
        }

        return $this->downvotedBy()->where('user_id', $userId)->exists();
    }

    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }
}
