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
        $posts = FeedPost::with('source')
            ->when($request->filter === 'trending', fn ($q) => $q->trending())
            ->when($request->filter === 'popular', fn ($q) => $q->popular())
            ->when($request->filter === 'bookmarked', function ($q) use ($request) {
                $q->whereHas('bookmarkedBy', fn ($query) => $query->where('user_id', $request->user()->id));
            })
            ->latest('published_at')
            ->paginate(24);

        return FeedPostResource::collection($posts);
    }

    public function show(FeedPost $feedPost)
    {
        $feedPost->load(['source', 'comments.user', 'comments.replies.user']);
        $feedPost->increment('views_count');

        return new FeedPostResource($feedPost);
    }
}
