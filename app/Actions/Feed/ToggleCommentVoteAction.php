<?php

namespace App\Actions\Feed;

use App\Models\FeedComment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ToggleCommentVoteAction
{
    public function execute(FeedComment $comment, User $user, string $voteType): array
    {
        if (! in_array($voteType, ['upvote', 'downvote'])) {
            throw new \InvalidArgumentException('Vote type must be either upvote or downvote');
        }

        $oppositeVoteType = $voteType === 'upvote' ? 'downvote' : 'upvote';

        return DB::transaction(function () use ($comment, $user, $voteType, $oppositeVoteType) {
            $existingVote = DB::table('feed_comment_user')
                ->where('feed_comment_id', $comment->id)
                ->where('user_id', $user->id)
                ->first();

            // If user has voted this way, remove it
            if ($existingVote && $existingVote->vote_type === $voteType) {
                DB::table('feed_comment_user')
                    ->where('id', $existingVote->id)
                    ->delete();

                $comment->decrement($voteType.'s_count');

                return [
                    'action' => 'removed',
                    'type' => $voteType,
                    'upvotes_count' => $comment->fresh()->upvotes_count,
                    'downvotes_count' => $comment->fresh()->downvotes_count,
                ];
            }

            // If user voted the opposite way, update the vote
            if ($existingVote && $existingVote->vote_type === $oppositeVoteType) {
                DB::table('feed_comment_user')
                    ->where('id', $existingVote->id)
                    ->update(['vote_type' => $voteType, 'updated_at' => now()]);

                $comment->decrement($oppositeVoteType.'s_count');
                $comment->increment($voteType.'s_count');

                return [
                    'action' => 'changed',
                    'type' => $voteType,
                    'upvotes_count' => $comment->fresh()->upvotes_count,
                    'downvotes_count' => $comment->fresh()->downvotes_count,
                ];
            }

            // Add new vote
            DB::table('feed_comment_user')->insert([
                'feed_comment_id' => $comment->id,
                'user_id' => $user->id,
                'vote_type' => $voteType,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $comment->increment($voteType.'s_count');

            return [
                'action' => 'added',
                'type' => $voteType,
                'upvotes_count' => $comment->fresh()->upvotes_count,
                'downvotes_count' => $comment->fresh()->downvotes_count,
            ];
        });
    }
}
