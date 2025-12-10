<?php

namespace App\Actions\Feed;

use App\Models\FeedPost;
use App\Models\FeedPostVote;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TogglePostVoteAction
{
    public function execute(FeedPost $post, User $user, string $voteType): array
    {
        if (! in_array($voteType, ['upvote', 'downvote'])) {
            throw new \InvalidArgumentException('Vote type must be either upvote or downvote');
        }

        $oppositeVoteType = $voteType === 'upvote' ? 'downvote' : 'upvote';

        return DB::transaction(function () use ($post, $user, $voteType, $oppositeVoteType) {
            // Check if user has already voted this way
            $existingVote = FeedPostVote::where('feed_post_id', $post->id)
                ->where('user_id', $user->id)
                ->where('vote_type', $voteType)
                ->first();

            if ($existingVote) {
                // Remove the vote
                $existingVote->delete();
                $post->decrement($voteType.'s_count');

                return [
                    'action' => 'removed',
                    'type' => $voteType,
                    'upvotes_count' => $post->fresh()->upvotes_count,
                    'downvotes_count' => $post->fresh()->downvotes_count,
                ];
            }

            // Check if user voted the opposite way
            $oppositeVote = FeedPostVote::where('feed_post_id', $post->id)
                ->where('user_id', $user->id)
                ->where('vote_type', $oppositeVoteType)
                ->first();

            if ($oppositeVote) {
                // Update the vote type instead of creating new
                $oppositeVote->update(['vote_type' => $voteType]);
                $post->decrement($oppositeVoteType.'s_count');
                $post->increment($voteType.'s_count');

                return [
                    'action' => 'changed',
                    'type' => $voteType,
                    'upvotes_count' => $post->fresh()->upvotes_count,
                    'downvotes_count' => $post->fresh()->downvotes_count,
                ];
            }

            // Add new vote
            FeedPostVote::create([
                'feed_post_id' => $post->id,
                'user_id' => $user->id,
                'vote_type' => $voteType,
            ]);

            $post->increment($voteType.'s_count');

            return [
                'action' => 'added',
                'type' => $voteType,
                'upvotes_count' => $post->fresh()->upvotes_count,
                'downvotes_count' => $post->fresh()->downvotes_count,
            ];
        });
    }
}
