<?php

namespace App\Http\Controllers\Application\Feed;

use App\Http\Controllers\Controller;
use App\Http\Resources\Application\Feed\FeedPostResource;
use App\Models\FeedPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()?->id;

        $posts = FeedPost::query()
            ->filter($request->all())
            ->with([
                'source',
                'comments.user',
                'comments.replies.user',
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
            ->latest('published_at')
            ->cursorPaginate(20);

        return Inertia::render('User/Feed', [
            'posts' => FeedPostResource::collection($posts),
        ]);
    }
}
