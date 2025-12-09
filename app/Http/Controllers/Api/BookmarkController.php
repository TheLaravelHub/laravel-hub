<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Application\Feed\FeedPostResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function index(Request $request): JsonResponse
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

        return response()->json([
            'data' => FeedPostResource::collection($posts->items()),
            'meta' => [
                'next_cursor' => $posts->nextCursor()?->encode(),
                'prev_cursor' => $posts->previousCursor()?->encode(),
                'per_page' => $posts->perPage(),
            ],
        ]);
    }
}
