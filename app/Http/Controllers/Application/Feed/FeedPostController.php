<?php

namespace App\Http\Controllers\Application\Feed;

use App\Http\Controllers\Controller;
use App\Http\Resources\Application\Feed\FeedPostResource;
use App\Models\FeedPost;
use Illuminate\Http\Request;

class FeedPostController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()?->id;

        $posts = FeedPost::query()
            ->with([
                'source',
                'upvotedBy' => function ($query) use ($userId) {
                    if ($userId) {
                        $query->where('user_id', $userId);
                    }
                },
                'downvotedBy' => function ($query) use ($userId) {
                    if ($userId) {
                        $query->where('user_id', $userId);
                    }
                },
                'bookmarkedBy' => function ($query) use ($userId) {
                    if ($userId) {
                        $query->where('user_id', $userId);
                    }
                },
            ])
            ->when($request->filter === 'trending', fn ($q) => $q->trending())
            ->when($request->filter === 'popular', fn ($q) => $q->popular())
            ->when($request->filter === 'bookmarked', function ($q) use ($request) {
                $q->whereHas('bookmarkedBy', fn ($query) => $query->where('user_id', $request->user()->id));
            })
            ->latest('published_at')
            ->paginate(24);

        return FeedPostResource::collection($posts);
    }

    public function show(Request $request, FeedPost $feedPost)
    {
        $userId = $request->user()?->id;

        $feedPost->load([
            'source',
            'comments.user',
            'comments.replies.user',
            // Eager load user votes and bookmarks to prevent N+1 queries
            'upvotedBy' => function ($query) use ($userId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                }
            },
            'downvotedBy' => function ($query) use ($userId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                }
            },
            'bookmarkedBy' => function ($query) use ($userId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                }
            },
        ]);
        $feedPost->increment('views_count');

        return new FeedPostResource($feedPost);
    }
}
