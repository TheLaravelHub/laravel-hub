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
        $blogPosts = BlogPost::with(['author', 'categories'])
            ->published()
            ->orderByDesc('published_at')
            ->limit(25)
            ->get()
            ->map(function ($post) {
                $feedItem = FeedItem::create()
                    ->id(route('blog.show', $post->slug))
                    ->title('[Blog Post] '.$post->title)
                    ->summary($post->sub_title ?? strip_tags(substr($post->content, 0, 200)).'...')
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

        $packages = Package::with(['categories', 'user'])
            ->where('status', 'active')
            ->orderByDesc('created_at')
            ->limit(25)
            ->get()
            ->map(function ($package) {
                $feedItem = FeedItem::create()
                    ->id(route('packages.show', $package->slug))
                    ->title('[Package] '.$package->name)
                    ->summary($package->description ?? 'No description available')
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
