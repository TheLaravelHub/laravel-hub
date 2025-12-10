<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class FeedPostBookmark extends Pivot
{
    protected $table = 'feed_post_bookmarks';

    protected $fillable = [
        'feed_post_id',
        'user_id',
    ];

    public function feedPost(): BelongsTo
    {
        return $this->belongsTo(FeedPost::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
