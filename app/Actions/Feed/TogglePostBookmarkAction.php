<?php

namespace App\Actions\Feed;

use App\Models\FeedPost;
use App\Models\FeedPostBookmark;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TogglePostBookmarkAction
{
    public function execute(FeedPost $post, User $user): array
    {
        return DB::transaction(function () use ($post, $user) {
            $existingBookmark = FeedPostBookmark::where('feed_post_id', $post->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existingBookmark) {
                $existingBookmark->delete();
                $post->decrement('bookmarks_count');

                return [
                    'action' => 'removed',
                    'bookmarks_count' => $post->fresh()->bookmarks_count,
                ];
            }

            FeedPostBookmark::create([
                'feed_post_id' => $post->id,
                'user_id' => $user->id,
            ]);

            $post->increment('bookmarks_count');

            return [
                'action' => 'added',
                'bookmarks_count' => $post->fresh()->bookmarks_count,
            ];
        });
    }
}
