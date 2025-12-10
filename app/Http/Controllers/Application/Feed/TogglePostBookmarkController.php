<?php

namespace App\Http\Controllers\Application\Feed;

use App\Actions\Feed\TogglePostBookmarkAction;
use App\Http\Controllers\Controller;
use App\Models\FeedPost;
use Illuminate\Http\Request;

class TogglePostBookmarkController extends Controller
{
    public function __invoke(Request $request, FeedPost $feedPost)
    {
        $action = new TogglePostBookmarkAction;
        $result = $action->execute($feedPost, $request->user());

        return response()->json([
            'is_bookmarked' => $result['action'] === 'added',
            'bookmarks_count' => $result['bookmarks_count'],
            'action' => $result['action'],
        ]);
    }
}
