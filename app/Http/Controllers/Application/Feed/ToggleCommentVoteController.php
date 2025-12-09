<?php

namespace App\Http\Controllers\Application\Feed;

use App\Actions\Feed\ToggleCommentVoteAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Application\Feed\ToggleVoteRequest;
use App\Models\FeedComment;

class ToggleCommentVoteController extends Controller
{
    public function __invoke(ToggleVoteRequest $request, FeedComment $feedComment)
    {
        $action = new ToggleCommentVoteAction;
        $result = $action->execute($feedComment, $request->user(), $request->vote_type);

        return response()->json([
            'upvotes' => $result['upvotes_count'],
            'downvotes' => $result['downvotes_count'],
            'action' => $result['action'],
        ]);
    }
}
