<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class FeedPostVote extends Pivot
{
    protected $table = 'feed_post_votes';

    protected $fillable = [
        'feed_post_id',
        'user_id',
        'vote_type',
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
