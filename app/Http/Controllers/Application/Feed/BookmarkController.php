<?php

namespace App\Http\Controllers\Application\Feed;

use App\Http\Controllers\Controller;
use App\Http\Resources\Application\Feed\FeedPostResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookmarkController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;
        $query = $request->user()->bookmarkedPosts();

        if ($request->has('query')) {
            $query->filter($request->all());
        }

        $posts = $query
            ->with([
                'source',
                'comments.user',
                'comments.replies.user',
                'upvotedBy' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
                'downvotedBy' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
                'bookmarkedBy' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
            ])
            ->latest('feed_post_bookmarks.created_at')
            ->cursorPaginate(20);

        return Inertia::render('Application/Bookmarks', [
            'posts' => FeedPostResource::collection($posts),
        ]);
    }
}
