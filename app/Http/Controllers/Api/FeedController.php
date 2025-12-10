<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Application\Feed\FeedPostResource;
use App\Models\FeedPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $posts = FeedPost::filter($request->all())
            ->with(['source', 'comments.user', 'comments.replies.user'])
            ->latest('published_at')
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
