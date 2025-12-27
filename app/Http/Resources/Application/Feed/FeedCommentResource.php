<?php

namespace App\Http\Resources\Application\Feed;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedCommentResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'content' => $this->content,
            'upvotes' => $this->upvotes_count,
            'downvotes' => $this->downvotes_count,
            'created_at' => $this->created_at->diffForHumans(),
            'is_upvoted' => $user ? $this->hasUserUpvoted($user->id) : false,
            'is_downvoted' => $user ? $this->hasUserDownvoted($user->id) : false,
            'author' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'username' => $this->user->username,
                'avatar' => $this->user->avatar,
            ],
            'replies' => FeedCommentResource::collection($this->whenLoaded('replies')),
        ];
    }
}
