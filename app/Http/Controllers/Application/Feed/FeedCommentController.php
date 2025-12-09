<?php

namespace App\Http\Controllers\Application\Feed;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\Feed\CreateCommentRequest;
use App\Http\Resources\Application\Feed\FeedCommentResource;
use App\Models\FeedComment;
use App\Models\FeedPost;

class FeedCommentController extends Controller
{
    public function __invoke(CreateCommentRequest $request, FeedPost $feedPost)
    {
        // Prevent nested replies (only one level)
        if ($request->parent_id) {
            $parent = FeedComment::find($request->parent_id);
            if ($parent && $parent->parent_id !== null) {
                return response()->json([
                    'message' => 'Replies to replies are not allowed',
                ], 422);
            }
        }

        $comment = $feedPost->allComments()->create([
            'user_id' => $request->user()->id,
            'parent_id' => $request->parent_id,
            'content' => $request->content,
        ]);

        $feedPost->increment('comments_count');

        return new FeedCommentResource($comment->load(['user', 'replies']));
    }
}
