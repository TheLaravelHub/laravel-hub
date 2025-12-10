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
        $query = $request->user()->bookmarkedPosts();

        // Apply filter if query parameter is provided
        if ($request->has('query')) {
            $query->filter($request->all());
        }

        $posts = $query
            ->with(['source', 'comments.user', 'comments.replies.user'])
            ->latest('feed_post_bookmarks.created_at')
            ->cursorPaginate(20);

        return Inertia::render('Application/Bookmarks', [
            'posts' => FeedPostResource::collection($posts),
        ]);
    }
}
