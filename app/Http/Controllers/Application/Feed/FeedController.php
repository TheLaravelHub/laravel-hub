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
        $posts = FeedPost::filter($request->all())
            ->with(['source', 'comments.user', 'comments.replies.user'])
            ->latest('published_at')
            ->cursorPaginate(20);

        return Inertia::render('User/Feed', [
            'posts' => FeedPostResource::collection($posts),
        ]);
    }
}
