<?php

namespace App\Http\Controllers\Application\Feed;

use App\Actions\Feed\TogglePostVoteAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Application\Feed\ToggleVoteRequest;
use App\Models\FeedPost;

class TogglePostVoteController extends Controller
{
    public function __invoke(ToggleVoteRequest $request, FeedPost $feedPost, TogglePostVoteAction $togglePostVoteAction)
    {
        $result = $togglePostVoteAction->execute($feedPost, $request->user(), $request->vote_type);

        return response()->json([
            'upvotes' => $result['upvotes_count'],
            'downvotes' => $result['downvotes_count'],
            'action' => $result['action'],
        ]);
    }
}
