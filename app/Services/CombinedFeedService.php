<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\Package;
use Spatie\Feed\FeedItem;

class CombinedFeedService
{
    /**
     * Get combined feed items from blog posts and packages
     */
    public static function getFeedItems()
    {
        $blogPosts = BlogPost::with(['author', 'categories', 'media'])
            ->published()
            ->orderByDesc('published_at')
            ->limit(25)
            ->get()
            ->map(function ($post) {
                // Get blog post image from media library
                $imageUrl = $post->getFirstMediaUrl();

                // Build description with image if available
                $description = $post->sub_title ?? strip_tags(substr($post->content, 0, 200)).'...';
                if ($imageUrl) {
                    $description = sprintf(
                        '<p><a href="%s"><img src="%s" alt="%s"></a></p><hr>%s',
                        route('blog.show', $post->slug),
                        $imageUrl,
                        htmlspecialchars($post->title),
                        $description
                    );
                }

                $feedItem = FeedItem::create()
                    ->id(route('blog.show', $post->slug))
                    ->title($post->title)
                    ->summary($description)
                    ->updated($post->updated_at)
                    ->link(route('blog.show', $post->slug))
                    ->authorName($post->author->name)
                    ->authorEmail($post->author->email)
                    ->category(...$post->categories->pluck('name')->toArray());

                return [
                    'item' => $feedItem,
                    'timestamp' => $post->published_at->timestamp,
                ];
            });

        $packages = Package::with(['categories', 'user', 'media'])
            ->where('status', 'active')
            ->orderByDesc('created_at')
            ->limit(25)
            ->get()
            ->map(function ($package) {
                $imageUrl = $package->getFirstMediaUrl('og-images');

                // Build description with OG image
                $description = $package->description ?? 'No description available';
                if ($imageUrl) {
                    $description = sprintf(
                        '<p><a href="%s"><img src="%s" alt="%s"></a></p><hr>%s',
                        route('packages.show', $package->slug),
                        $imageUrl,
                        htmlspecialchars($package->name),
                        $description
                    );
                }

                $feedItem = FeedItem::create()
                    ->id(route('packages.show', $package->slug))
                    ->title('Package: '.$package->name)
                    ->summary($description)
                    ->updated($package->updated_at)
                    ->link(route('packages.show', $package->slug))
                    ->category(...$package->categories->pluck('name')->toArray());

                if ($package->user) {
                    $feedItem->authorName($package->user->name)
                        ->authorEmail($package->user->email);
                }

                return [
                    'item' => $feedItem,
                    'timestamp' => $package->created_at->timestamp,
                ];
            });

        // Combine and sort by timestamp, return as Collection
        return $blogPosts->concat($packages)
            ->sortByDesc('timestamp')
            ->pluck('item')
            ->values();
    }
}
