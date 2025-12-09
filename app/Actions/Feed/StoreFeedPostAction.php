<?php

namespace App\Actions\Feed;

use App\Models\FeedPost;
use App\Models\FeedSource;

class StoreFeedPostAction
{
    public function execute(FeedSource $source, array $postData): array
    {
        // Skip posts without images
        if (empty($postData['image_url'])) {
            return [
                'post' => null,
                'is_new' => false,
                'skipped' => true,
                'reason' => 'No image URL provided',
            ];
        }

        // Check if post already exists by external_id
        $existingPost = FeedPost::where('feed_source_id', $source->id)
            ->where('external_id', $postData['external_id'])
            ->first();

        if ($existingPost) {
            // Update existing post
            $existingPost->update([
                'title' => $postData['title'],
                'excerpt' => $postData['excerpt'],
                'content' => $postData['content'],
                'image_url' => $postData['image_url'] ?? $existingPost->image_url,
            ]);

            return [
                'post' => $existingPost,
                'is_new' => false,
                'skipped' => false,
            ];
        }

        // Create new post
        $post = FeedPost::create([
            'feed_source_id' => $source->id,
            'title' => $postData['title'],
            'slug' => $postData['slug'],
            'subtitle' => $postData['subtitle'] ?? null,
            'excerpt' => $postData['excerpt'],
            'content' => $postData['content'],
            'image_url' => $postData['image_url'],
            'external_url' => $postData['external_url'],
            'external_id' => $postData['external_id'],
            'published_at' => $postData['published_at'],
        ]);

        return [
            'post' => $post,
            'is_new' => true,
            'skipped' => false,
        ];
    }
}
