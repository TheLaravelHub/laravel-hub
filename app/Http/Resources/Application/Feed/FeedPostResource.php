<?php

namespace App\Http\Resources\Application\Feed;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedPostResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'subtitle' => $this->subtitle,
            'excerpt' => $this->excerpt,
            'content' => $this->when($request->routeIs('feed.posts.show'), $this->content),
            'image' => $this->image_url ?: 'https://placehold.co/800x450/e2e8f0/64748b?text='.urlencode(substr($this->title, 0, 50)),
            'url' => $this->external_url,
            'published_at' => $this->published_at?->toISOString(),
            'source' => new FeedSourceResource($this->whenLoaded('source')),
            'upvotes' => $this->upvotes_count,
            'downvotes' => $this->downvotes_count,
            'comments' => $this->comments_count,
            'bookmarks' => $this->bookmarks_count,
            'shares' => $this->shares_count,
            'views' => $this->views_count,
            'tags' => $this->tags,
            'is_upvoted' => $user ? $this->hasUserUpvoted($user->id) : false,
            'is_downvoted' => $user ? $this->hasUserDownvoted($user->id) : false,
            'is_bookmarked' => $user ? $this->hasUserBookmarked($user->id) : false,
            'comments_data' => FeedCommentResource::collection($this->whenLoaded('comments')),
        ];
    }
}
